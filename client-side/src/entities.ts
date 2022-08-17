import { NgComponentRelation } from "@pepperi-addons/papi-sdk";
import { IAddonBlockLoaderDialogOptions } from "@pepperi-addons/ngx-lib/remote-loader";

import { EventInterceptor, LogicBlock } from "shared";

export interface HostEvent {
    PossibleEvents: EventData[];
    AddonUUID: string;
    Name: string;
}

export interface EventData {
    Title: string;
    EventKey: string;
    EventFilter: {
        [key:string]: any;
    };
    Fields: [{
        ApiName: string;
        Title: string;
    }];
}

export interface CreateFormData {
    Events: EventData[];
    AddonUUID: string;
    Name: string;
    CurrentEvents: Map<string, EventInterceptor[]>
}

export interface LogicBlockEditorOptions extends IAddonBlockLoaderDialogOptions {
    block: LogicBlock;
}

export interface LogicBlockRelation extends NgComponentRelation {
    BlockExecutionRelativeURL: string;
}

export type ActionType = 'Add' | 'Edit' | 'Delete';

export interface ActionClickedEventData {
    ActionType: ActionType,
    ItemKey?: string
}


