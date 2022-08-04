import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IPepGenericListActions, IPepGenericListDataSource } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { EventInterceptor } from 'shared';
import { ActionClickedEventData } from 'src/entities';

@Component({
    selector: 'events-list',
    templateUrl: './events-list.component.html',
    styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnChanges {

    @Input() events: EventInterceptor[] = [];

    @Output() listActionClicked: EventEmitter<ActionClickedEventData> = new EventEmitter<ActionClickedEventData>();

    dataSource: IPepGenericListDataSource;
    listMessages: { [key: string]: string };

    constructor(private translate: TranslateService) { }

    ngOnInit() {
        this.translate.get(['Events_List_NoDataFound']).subscribe(translations => {
            this.listMessages = translations;
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if(!changes.events.firstChange) {
            this.dataSource = this.getDataSource();
        }
    }

    getDataSource() {
        return {
            init: async (params: any) => {
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
                                FieldID: 'EventKey',
                                Type: 'TextBox',
                                Title: this.translate.instant('Name'),
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'EventField',
                                Type: 'TextBox',
                                Title: this.translate.instant('Field'),
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
                    totalCount: this.events.length,
                    items: this.events
                };
            },
            inputs: {
                pager: {
                    type: 'scroll'
                },
                selectionType: 'single',
                noDataFoundMsg: this.translate.instant('Events_List_NoDataFound')
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

    openCreateEventsForm() {
        this.listActionClicked.emit({
            ActionType: 'Add'
        });
    }

}
