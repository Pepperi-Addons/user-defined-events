import { AddonData } from "@pepperi-addons/papi-sdk";

export interface EventInterceptor extends AddonData {
    AddonUUID: string;
    Group: string;
    EventKey: string;
    EventFilter: string;
    EventField?: string;
    LogicBlocks: LogicBlock[];
}

export interface LogicBlock {
    Relation: {
        AddonUUID: string;
        Name: string;
    };
    Name: string;
    Configuration: string;
    Disabled: boolean;
    ParallelExecutionGroup: number;
}