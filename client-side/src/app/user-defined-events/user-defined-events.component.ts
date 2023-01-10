import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

import { IPepGenericListActions, IPepGenericListDataSource, GenericListComponent } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { EventsService } from '../services/events-service';
import { EventDataFields, EventInterceptor, groupBy } from 'shared';
import { CreateEventComponent } from '../create-event/create-event.component';
import { ActionClickedEventData, CreateFormData, HostEvent } from 'src/entities';
import { BlockConfigurationLoaderService } from '../services/block-configuration-loader-service';
import { BlocksService } from '../services/blocks-service';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';

@Component({
    selector: 'user-defined-events',
    templateUrl: './user-defined-events.component.html',
    styleUrls: ['./user-defined-events.component.scss']
})
export class UserDefinedEventsComponent implements OnInit {
    @Input() hostObject: HostEvent;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    events: EventInterceptor[] = [];
    availableBlocks: Array<IPepDraggableItem> = [];
    chosenEvent: EventInterceptor = null;
    chosenEventData: EventDataFields;

    constructor(
        private translate: TranslateService,
        private eventsService: EventsService,
        private dialogService: PepDialogService,
        private blocksService: BlocksService) {
    }

    ngOnInit() {
        this.updateEvents();
        this.blocksService.getAvailableBlocks().then(relations => {
            this.availableBlocks = relations.map(relation => {
              return {
                title: relation.Name,
                disabled: false,
                data: {
                    key: relation.AddonUUID,
                    addonUUID: relation.AddonUUID,
                    blockExecutionRelativeURL: relation.BlockExecutionRelativeURL,
                    moduleName: relation.ModuleName,
                    componentName: relation.ComponentName,
                }
              }
            })
          })
    }

    updateEvents() {
        this.eventsService.getEvents(this.hostObject.AddonUUID, this.hostObject.Name).then(events => {
            this.events = [...events];
        })
    }

    onActionClicked(data: ActionClickedEventData) {
        switch (data.ActionType) {
            case 'Add': {
                this.openCreateEventsForm();
                break;
            }
            case 'Edit': {
                this.navigateToEventForm(data.ItemKey);
                break;
            }
            case 'Delete': {
                this.showDeleteDialog(data.ItemKey);
                break;
            }
        }
    }

    navigateToEventForm(itemKey: string) {
        this.chosenEvent = this.events.find(event => event.Key === itemKey);
        const event = this.hostObject.PossibleEvents.find(item => item.EventKey === this.chosenEvent.EventKey);
        if(event) {
            this.chosenEventData = event.EventData;
        }
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
                        const obj: EventInterceptor = this.events.find(item => item.Key === objID);
                        obj.Hidden = true;
                        await this.eventsService.upsertEvent(obj);
                        this.updateEvents();
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
        const groupedEvents = groupBy(this.events, (item) => item.EventKey);
        const formData: CreateFormData = {
            Events: this.hostObject.PossibleEvents,
            AddonUUID: this.hostObject.AddonUUID,
            Name: this.hostObject.Name,
            CurrentEvents: groupedEvents,
        }
        const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
        dialogConfig.data = {
            content: CreateEventComponent
        }

        this.dialogService.openDialog(CreateEventComponent, formData, dialogConfig).afterClosed().subscribe((createdEvent: EventInterceptor) => {
            if (createdEvent) {
                this.events.push(createdEvent);
                this.navigateToEventForm(createdEvent.Key);
            }
        })
    }

    async saveEventLogic(logicBlocks) {
        try {
            this.chosenEvent.LogicBlocks = [...logicBlocks];
            await this.eventsService.upsertEvent(this.chosenEvent);
            this.updateEvents();
            this.chosenEvent = null;
        }
        catch(error) {
            console.log(`cannot update event. got error ${error}`);
        }
    }

    showList() {
        this.chosenEvent = null;
        this.updateEvents();
    }
}
