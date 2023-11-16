import '@pepperi-addons/cpi-node'
import  config  from '../addon.config.json';
import { EventInterceptor, EventsInterceptorsScheme, groupBy, LogicBlock } from 'shared';
import { Relation } from '@pepperi-addons/papi-sdk';
import { DateUtils } from './date_utils';

export const router = Router()
let lastSyncEvents: number = 0;

export async function load() {
    let relation: Relation = {
        Type: "CPIAddonAPI",
        AddonRelativeURL: "/events/after_sync_registration",
        AddonUUID: config.AddonUUID,
        RelationName: "AfterSync",
        Name: "events_after_sync_registration",
    }
    
    await pepperi.addons.data.relations.upsert(relation);
    const events = await getEvents();
    lastSyncEvents = events.length;
    subscribe(events);
}

router.post('/after_sync_registration', async (req, res, next) => {
    shouldReload(req).then(shouldReload => {
        res.json({
            ShouldReload: shouldReload
        });
    }).catch(next);
})

async function shouldReload(req) {
    const lastSyncTime = DateUtils.getLastSyncDataTimeMills(req.body.JobInfoResponse.ClientInfo.LastSyncDateTime);
    const events = await getEvents();
    const modified = events.filter(item => {
        return new Date(item.ModificationDateTime!) > new Date(lastSyncTime)
    })
    if(events.length > lastSyncEvents && modified.length === 0) {
        console.error(`shouldReload => we shouldn't get here! events.length > lastSyncEvents`);
    }
    let shouldReload = (modified && modified.length > 0) || (events.length != lastSyncEvents)
    lastSyncEvents = events.length;
    console.log(`shouldReload => return value: ${shouldReload}`);
    return shouldReload;
}

async function getEvents() {
    return (await pepperi.api.adal.getList({
        addon: config.AddonUUID,
        table: EventsInterceptorsScheme.Name
    })).objects as EventInterceptor[];
}

async function subscribe(events: EventInterceptor[]) {
 
    console.log(`after getting events, received: ${JSON.stringify(events)}`);
    events.forEach(event => {
        const filter = event.EventField ? { FieldID: event.EventField, ...event.EventFilter } : event.EventFilter;
        let result: any = {};
        pepperi.events.intercept(event.EventKey as any, filter, async (data, next, main) => {
            const groups: Map<number,LogicBlock[]> = groupBy(event.LogicBlocks, x => !!Number(x.ParallelExecutionGroup) ? Number(x.ParallelExecutionGroup): Number.MAX_VALUE);
            const sorted = new Map([...groups.entries()].sort((a,b) => {
                return a[0] - b[0];
            }))
            console.log(`inside ${event.EventKey} event. \n after group by. groups: ${JSON.stringify(sorted.entries())}`);
            for await (const groupKey of sorted.keys()) {
                const blocksToRun = sorted.get(groupKey)?.filter(val => !val.Disabled);
                const value = await handleGroupBlocks(blocksToRun, data, groupKey != Number.MAX_VALUE);
                result = {...result, ...value};
            }

            await next(main);

            return result;
        })
    });
}

async function handleGroupBlocks(blocks?: LogicBlock[], eventData?: any, parallelExecution: boolean = false): Promise<any> {
    let result: any = {};
    if(blocks && blocks.length > 0) {
        if(parallelExecution) {
            result = (await Promise.all(blocks.map(block => {
                return runSingleBlock(block, eventData);
            }))).reduce((prev, current) => {
                prev = {...prev, ...current};
                return prev;
            }, {})
        }
        else {
            for (const block of blocks) {
                const value = await runSingleBlock(block, eventData);
                result = {...result, ...value}
            }
        }
    }
    return result;
}

async function runSingleBlock(block: LogicBlock, data): Promise<any> {
    return pepperi.addons.api.uuid(block.Relation.AddonUUID).post({
        url: block.Relation.BlockExecutionRelativeURL,
        body: block.Configuration,
        context: data
    })    
}