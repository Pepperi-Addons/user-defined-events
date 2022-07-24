export interface HostEvent {
    PossibleEvents: EventData[];
    PossibleFields: string[];
    AddonUUID: string;
    Group: string;
}

export interface EventData {
    EventKey: string;
    EventFilter: string;
    SupportField: boolean;
}

export interface CreateFormData {
    Events: EventData[];
    Fields: string[];
    AddonUUID: string;
    Group: string;
}

