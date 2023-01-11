import { AddonData, AddonDataScheme } from "@pepperi-addons/papi-sdk";

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

export type SelectOptions<T> = Array<SelectOption<T>>;

export type EventDataFields = AddonDataScheme['Fields'];