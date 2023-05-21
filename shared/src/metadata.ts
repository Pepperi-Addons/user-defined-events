import { AddonDataScheme, Relation } from "@pepperi-addons/papi-sdk";
import config from '../../addon.config.json';

const blockName = 'FlowPicker';
const relationName = 'UserDefinedFlows'
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

export const FlowsAddonBlockRelation: Relation = {
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
    ElementName: `flow-picker-element-${config.AddonUUID}`
}

export const SettingsRelation: Relation = {
    RelationName: "SettingsBlock",
    GroupName: 'Configuration',
    SlugName: 'flows',
    Name: relationName,
    Description: 'Flows',
    Type: "NgComponent",
    SubType: "NG14",
    AddonUUID: config.AddonUUID,
    AddonRelativeURL: fileName,
    ComponentName: `${relationName}Component`,
    ModuleName: `${relationName}Module`,
    ElementsModule: 'WebComponents',
    ElementName: `user-defined-flows-element-${config.AddonUUID}`
}