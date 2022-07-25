import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { IPepGenericListActions, IPepGenericListDataSource, GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { EventsService } from '../services/events-service';
import { EventInterceptor, groupBy } from 'shared';
import { CreateEventComponent } from '../create-event/create-event.component';
import { CreateFormData, HostEvent } from 'src/entities';

@Component({
    selector: 'events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
    @Input() hostObject: HostEvent;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('eventsList', {read: GenericListComponent}) eventsList: GenericListComponent

    dataSource: IPepGenericListDataSource;
    listMessages: {[key:string]: string};
    events: EventInterceptor[] = [];

    constructor(
        private translate: TranslateService,
        private eventsService: EventsService,
        private router: Router,
        private activateRoute: ActivatedRoute,
        private dialogService: PepDialogService) {
    }

    ngOnInit() {
        this.translate.get(['Events_List_NoDataFound']).subscribe(translations=> {
            this.listMessages = translations;
            this.dataSource = this.getDataSource();
        })
    }

    getDataSource() {
        return {
            init: async(params:any) => {
                this.events = await this.eventsService.getEvents();
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
                noDataFoundMsg: this.listMessages['Events_List_NoDataFound']
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
                        this.navigateToEventForm(objs.rows[0]);
                    }
                });
                actions.push({
                    title: this.translate.instant('Delete'),
                    handler: async (objs) => {
                        this.showDeleteDialog(objs.rows[0]);
                    }
                })
            }
            return actions;
        }
    }

    navigateToEventForm(name: string) {
        console.log(`edit event clicked. chosen event: ${name}`);
    }

    showDeleteDialog(objID: string) {
        const dataMsg = new PepDialogData({
            title: this.translate.instant('Events_DeleteDialogTitle'),
            actionsType: 'cancel-delete',
            content: this.translate.instant('Events_DeleteDialogContent')
        });
        this.dialogService.openDefaultDialog(dataMsg).afterClosed()
        .subscribe(async (isDeletePressed) => {
            if (isDeletePressed) {
                try {
                    const obj:EventInterceptor = this.events.find(item => item.Key === objID);
                    obj.Hidden = true;
                    await this.eventsService.upsertEvent(obj);
                    this.dataSource = this.getDataSource();
                }
                catch (error) {
                    const dataMsg = new PepDialogData({
                        title: this.translate.instant('Events_DeleteFailedDialogTitle'),
                        actionsType: 'close',
                        content: this.translate.instant('Events_DeleteFailedDialogError')
                    });
                    this.dialogService.openDefaultDialog(dataMsg);
                }
            }
        });
    }

    openCreateEventsForm() {
        const groupedEvents = groupBy(this.events, (item)=>item.EventKey);
        const formData: CreateFormData = {
            Events: this.hostObject.PossibleEvents,
            Fields: this.hostObject.PossibleFields,
            AddonUUID: this.hostObject.AddonUUID,
            Group: this.hostObject.Group,
            CurrentEvents: groupedEvents,
        }
        const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
        dialogConfig.data = {
            content: CreateEventComponent
        }

        this.dialogService.openDialog(CreateEventComponent, formData, dialogConfig).afterClosed().subscribe((createdEvent)=> {
            if(createdEvent) {
                this.navigateToEventForm(createdEvent.Key);
            }
        })
    }
}
