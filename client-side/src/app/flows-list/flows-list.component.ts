import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListActions, IPepGenericListDataSource, IPepGenericListParams } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { IPepFieldClickEvent } from '@pepperi-addons/ngx-lib';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { SearchData } from '@pepperi-addons/papi-sdk';
import { Flow } from 'shared';
import { ActionClickedEventData, GL_PAGE_SIZE } from 'src/entities';
import { FlowsService } from '../services/flows-service';

@Component({
    selector: 'flows-list',
    templateUrl: './flows-list.component.html',
    styleUrls: ['./flows-list.component.scss']
})
export class FlowsListComponent implements OnInit {

    flows: SearchData<Flow> = {
        Objects: [],
        Count: 0
    }

    @Output() listActionClicked: EventEmitter<ActionClickedEventData> = new EventEmitter<ActionClickedEventData>();

    dataSource: IPepGenericListDataSource;
    listMessages: { [key: string]: string };

    constructor(private translate: TranslateService,
                private flowsService: FlowsService,
                private dialogService: PepDialogService) { }

    ngOnInit() {
        this.translate.get(['Flows_List_EmptyState_Title', 'Flows_List_EmptyState_Description']).subscribe(translations => {
            this.listMessages = translations;
            this.dataSource = this.getDataSource();
        })
    }

    getDataSource() {
        return {
            init: async (params: IPepGenericListParams) => {
                try {
                    this.flows = await this.flowsService.getFlows(params);
                    console.log('flows received', this.flows);
                }
                catch (err) {
                    console.log('failed getting flows. got error', JSON.stringify(err));
                    this.showMessageInDialog('Flows_LoadingErrorDialog_Title', 'Flows_LoadingErrorDialog_Message');
                }
                return {
                    dataView: {
                        Context: {
                            Name: '',
                            Profile: { InternalID: 0 },
                            ScreenSize: 'Landscape'
                        },
                        Type: 'Grid',
                        Title: '',
                        Fields: [
                            {
                                FieldID: 'Name',
                                Type: 'Link',
                                Title: this.translate.instant('Name'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'Description',
                                Type: 'TextBox',
                                Title: this.translate.instant('Description'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                        ],
                        Columns: [
                            {
                                Width: 50
                            },
                            {
                                Width: 50
                            }
                        ],

                        FrozenColumnsCount: 0,
                        MinimumColumnWidth: 0
                    },
                    totalCount: this.flows.Count && this.flows.Count > 0 ? this.flows.Count : this.flows.Objects.length,
                    items: this.flows.Objects
                };
            },
            update: async (params: IPepGenericListParams) => {
                return (await this.flowsService.getFlows(params)).Objects;
            },
            inputs: {
                pager: {
                    type: 'scroll',
                },
                selectionType: 'single',
                emptyState: {
                    show: this.flows.Objects.length === 0,
                    title: this.listMessages['Flows_List_EmptyState_Title'],
                    description: this.listMessages['Flows_List_EmptyState_Description'],
                }
            },
        } as IPepGenericListDataSource
    }

    actions: IPepGenericListActions = {
        get: async (data: PepSelectionData) => {
            const actions = [];
            if (data && data.rows.length == 1) {
                actions.push({
                    title: this.translate.instant('Edit'),
                    handler: async (objs) => {
                        this.listActionClicked.emit({
                            ActionType: 'Edit',
                            ItemKey: objs.rows[0],
                        });
                    }
                });
                actions.push({
                    title: this.translate.instant('Delete'),
                    handler: async (objs) => {
                        this.listActionClicked.emit({
                            ActionType: 'Delete',
                            ItemKey: objs.rows[0],
                        });
                    }
                })
            }
            return actions;
        }
    }

    openCreateFlowForm() {
        this.listActionClicked.emit({
            ActionType: 'Add'
        });
    }

    onFieldClick(event: IPepFieldClickEvent) {
        const obj = this.flows.Objects.find(c => c.Name === event.value);
        this.listActionClicked.emit({
            ActionType: 'Edit',
            ItemKey: obj.Key,
        });
    }

    private showMessageInDialog(titleTranslationKey: string, messageTranslationKey: string) {
        const dataMsg = new PepDialogData({
            title: this.translate.instant(titleTranslationKey),
            actionsType: 'close',
            content: this.translate.instant(messageTranslationKey)
        });
        this.dialogService.openDefaultDialog(dataMsg);
    }
}
