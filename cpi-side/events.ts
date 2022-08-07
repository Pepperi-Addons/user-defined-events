import '@pepperi-addons/cpi-node'
import  config  from '../addon.config.json';
import { EventInterceptor, EventsInterceptorsScheme } from 'shared'

export async function load(configuration: any) {
    const events = (await pepperi.api.adal.getList({
        addon: config.AddonUUID,
        table: EventsInterceptorsScheme.Name
    })).objects as EventInterceptor[]
    console.log(`events registered: ${JSON.stringify(events)}`);
    pepperi.events.intercept('OnExecuteCommand', {}, async (data, next, main)=> {
        console.log('inside OnExecuteCommand interceptor');
        const res = await global['app'].addonLoader.executeAddonApi(
            `/bd822717-76bc-480c-8f71-7f38b1bab0cb/addon-cpi/example_block`, 
            'POST',
            JSON.stringify({
                slug: 'accounts'
            }),
            data.client
        );
        await next(main);
    })
}
