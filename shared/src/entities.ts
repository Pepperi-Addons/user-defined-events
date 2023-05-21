import { AddonData, AddonDataScheme, SchemeFieldType } from "@pepperi-addons/papi-sdk";

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

export const FlowStepsTypes: string[] = [
    'Group',
    'LogicBlock'
];

export type FlowStepsType = typeof FlowStepsTypes[number];

export interface FlowParam {
    Name: string;
    Type: SchemeFieldType;
    Description?: string;
    DefaultValue: any;
    Internal: boolean
}

export interface FlowGroupStep {
    Type: 'Group';
    Steps: FlowSteps[];
    Concurrent: boolean;
}

export interface FlowBlockStep {
    Type: 'LogicBlock';
    Configuration: any;
    Relation: {
        AddonUUID: string;
        Name: string;
        ExecutionURL: string;
    }
}

export type FlowSteps = FlowBlockStep | FlowGroupStep;

export interface Flow extends AddonData {
    Name: string;
    Description?: string;
    Params: FlowParam[];
    Steps: FlowSteps[];
}