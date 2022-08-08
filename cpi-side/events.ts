import '@pepperi-addons/cpi-node'
import  config  from '../addon.config.json';
import { EventInterceptor, EventsInterceptorsScheme, groupBy, LogicBlock } from 'shared'

export async function load(configuration: any) {
    const events = (await pepperi.api.adal.getList({
        addon: config.AddonUUID,
        table: EventsInterceptorsScheme.Name
    })).objects as EventInterceptor[]
    console.log(`events registered: ${JSON.stringify(events)}`);

    events.map(event => {
        const filter = event.EventField ? { FieldID: event.EventField, ...event.EventFilter } : event.EventFilter;
        console.log(`about to register ${event.EventKey} interceptor with the following filter ${filter}`);
        pepperi.events.intercept(event.EventKey as any, filter, async (data, next, main) => {
            const groups: Map<number,LogicBlock[]> = groupBy(event.LogicBlocks, x => !!Number(x.ParallelExecutionGroup) ? Number(x.ParallelExecutionGroup): Number.MAX_VALUE);
            const sorted = new Map([...groups.entries()].sort((a,b) => {
                return a[0] - b[0];
            }))
            debugger;
            console.log(`inside ${event.EventKey} event. \n after group by. groups: ${JSON.stringify(sorted.entries())}`);
            for await (const groupKey of sorted.keys()) {
                const blocksToRun = sorted.get(groupKey)?.filter(val => !val.Disabled);
                await handleGroupBlocks(blocksToRun, data, groupKey != Number.MAX_VALUE)
            }

            await next(main);
        })
    });
}

async function handleGroupBlocks(blocks?: LogicBlock[], eventData?: any, parallelExecution: boolean = false) {
    if(blocks && blocks.length > 0) {
        if(parallelExecution) {
            await Promise.all(blocks.map(block => {
                return runSingleBlock(block, eventData);
            }))
        }
        else {
            for (const block of blocks) {
                await runSingleBlock(block, eventData);
            }
        }
    }
}

async function runSingleBlock(block: LogicBlock, data) {
    return pepperi.addon.api.uuid(block.Relation.AddonUUID).post(block.Relation.BlockExecutionRelativeURL, block.Configuration, data?.client)
    
}