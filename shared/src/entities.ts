import { AddonData, AddonDataScheme, ConfigurationScheme } from "@pepperi-addons/papi-sdk";
import { AddonUUID } from '../../addon.config.json';
export interface EventInterceptor extends AddonData {
    AddonUUID: string;
    Name: string;
    EventTitle: string;
    EventKey: string;
    EventFilter: {
        [key: string]: any;
    };
    EventField?: string;
    LogicBlocks: LogicBlock[];
}

export interface LogicBlock {
    Relation: {
        AddonUUID: string;
        Name: string;
        BlockExecutionRelativeURL: string;
        ModuleName: string;
        ComponentName: string;
    };
    Name: string;
    Configuration: any;
    Disabled: boolean;
    ParallelExecutionGroup: number;
}

export interface SelectOption<T> {
    key: T;
    value: string;
}


export const configurationSchemaName = 'EventsConfigurations';

export const configurationFields = {
    AddonUUID: {
        Type: "String",
    },
    ContextKey: {
        Type: "String",
    },
    Title: {
        Type: "String",
    },
    EventKey: {
        Type: "String",
    },
    EventField: {
        Type: "String",
    },
    EventFilter: {
        Type: "Object",
    },
    Flow: {
        Type: "String",
    },
} as any;

export const configurationSchema: ConfigurationScheme = {
    Name: configurationSchemaName,
    AddonUUID: AddonUUID,
    Fields: configurationFields,
    SyncData:
    {
        Sync: true,
    }
};

export type SelectOptions<T> = Array<SelectOption<T>>;

export type EventDataFields = AddonDataScheme['Fields'];