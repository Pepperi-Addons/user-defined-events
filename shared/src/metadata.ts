import { AddonDataScheme } from "@pepperi-addons/papi-sdk";
import config from '../../addon.config.json';

export const EventsInterceptorsScheme : AddonDataScheme = {
    Name: 'event_interceptors',
    Type: 'meta_data',
    SyncData: {
        Sync: true,
    },
    AddonUUID: config.AddonUUID
}