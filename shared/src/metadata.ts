import { AddonDataScheme, Relation } from "@pepperi-addons/papi-sdk";
import config from '../../addon.config.json';

const blockName = 'Events';
const fileName = `file_${config.AddonUUID.replace(/-/g, '_').toLowerCase()}`;

export const EventsInterceptorsScheme : AddonDataScheme = {
    Name: 'event_interceptors',
    Type: 'meta_data',
    SyncData: {
        Sync: true,
    },
    AddonUUID: config.AddonUUID
}

export const EventsAddonBlockRelation: Relation = {
    RelationName: "AddonBlock",
    Name: blockName,
    Description: `${blockName} addon block`,
    Type: "NgComponent",
    SubType: "NG11",
    AddonUUID: config.AddonUUID,
    AddonRelativeURL: fileName,
    ComponentName: `${blockName}Component`,
    ModuleName: `${blockName}Module`
}