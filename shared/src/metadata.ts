import { AddonData, AddonDataScheme, Relation, SchemeField } from "@pepperi-addons/papi-sdk";
import config from '../../addon.config.json';

const blockName = 'UserDefinedEvents';
const fileName = `file_${config.AddonUUID}`;

export const EventsInterceptorsScheme : AddonDataScheme = {
    Name: 'event_interceptors',
    Type: 'meta_data',
    SyncData: {
        Sync: true,
    },
    AddonUUID: config.AddonUUID,
    Fields: {
        AddonUUID: {
            Type: 'String',
        },
        Name: {
            Type: 'String'
        },
        EventTitle: {
            Type: 'String',            
        },
        EventKey: {
            Type: 'String',            
        },
        EventField: {
            Type: 'String'
        },
        EventFilter: {
            Type: 'String'
        },
        LogicBlocks: {
            Type: 'Array',
            Items: {
                Type: 'Object',
                Fields: {
                    Relation: {
                        Type: 'Object',
                        Fields: {
                            AddonUUID: {
                                Type: 'String'
                            },
                            Name: {
                                Type: 'String'
                            }
                        }
                    },
                    Name: {
                        Type: 'String'
                    },
                    Configuration: {
                        Type: 'String'
                    },
                    Disabled: {
                        Type: 'Bool'
                    },
                    ParallelExecutionGroup: {
                        Type: 'Integer'
                    }
                }
            }
        }
    }
}

export const FlowsScheme: AddonDataScheme = {
    Name: "flows",
    Type: "meta_data",
    SyncData: {
        Sync: true
    },
    AddonUUID: config.AddonUUID,
    Fields: {
        Name: {
            Type: "String",
        },
        Description: {
            Type: "String"
        },
        Params: {
            Type: "Object",
            Fields: {
                Name: {
                    Type: "String",
                },
                Description: {
                    Type: "String",
                },
                DefaultValue: {
                    Type: "String"
                },
                Internal: {
                    Type: "Bool"
                }
            }
        },
        Steps: {
            Type: "Array",
            Items: {
                Type: "Object",
                Fields: {
                    Type: {
                        Type: "String",
                    },
                    Relation: {
                        Type: "Object",
                        Fields: {
                            AddonUUID: {
                                Type: "String",
                            },
                            Name: {
                                Type: "String",
                            },
                            ExecutionURL: {
                                Type: "String",
                            },
                        },
                    },
                    Configuration: {
                        Type: "String",
                    },
                    Concurrent: {
                        Type: "Bool"
                    }
                }
            }
        }
    }
}

export const EventsAddonBlockRelation: Relation = {
    RelationName: "AddonBlock",
    Name: blockName,
    Description: `${blockName} addon block`,
    Type: "NgComponent",
    SubType: "NG14",
    AddonUUID: config.AddonUUID,
    AddonRelativeURL: fileName,
    ComponentName: `${blockName}Component`,
    ModuleName: `${blockName}Module`,
    ElementsModule: 'WebComponents',
    ElementName: `user-defined-events-element-${config.AddonUUID}`
}