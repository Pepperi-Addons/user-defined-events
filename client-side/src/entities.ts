import { NgComponentRelation } from "@pepperi-addons/papi-sdk";
import { IAddonBlockLoaderDialogOptions } from "@pepperi-addons/ngx-lib/remote-loader";

import { EventInterceptor, LogicBlock, EventDataFields} from "shared";

export interface HostEvent {
    PossibleEvents: UserEvent[];
    AddonUUID: string;
    Name: string;
}

export interface UserEvent {
    Title: string;
    EventKey: string;
    EventFilter: {
        [key:string]: any;
    };
    Fields: [{
        ApiName: string;
        Title: string;
    }];
    EventData: EventDataFields;
}

export interface CreateFormData {
    Events: UserEvent[];
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

export const GL_PAGE_SIZE = 30;
export const API_PAGE_SIZE = 100;


