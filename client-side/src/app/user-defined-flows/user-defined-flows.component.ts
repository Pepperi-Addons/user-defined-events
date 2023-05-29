import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { EventDataFields, Flow } from 'shared';
import { ActionClickedEventData, HostEvent } from '../../entities';
import { BlocksService } from '../services/blocks-service';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { FlowsService } from '../services/flows-service';
import { AddonData } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'user-defined-flows',
    templateUrl: './user-defined-flows.component.html',
    styleUrls: ['./user-defined-flows.component.scss']
})
export class UserDefinedFlowsComponent implements OnInit {
    @Input() hostObject: HostEvent;

    @Output() hostFlows: EventEmitter<any> = new EventEmitter<any>();

    availableBlocks: Array<IPepDraggableItem> = [];
    chosenFlow: Flow = null;
    chosenFlowData: EventDataFields;

    constructor(
        private translate: TranslateService,
        private flowsService: FlowsService,
        private dialogService: PepDialogService,
        private blocksService: BlocksService) {
    }

    ngOnInit() {
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

    onActionClicked(data: ActionClickedEventData) {
        switch (data.ActionType) {
            case 'Add': {
                this.navigateToFlowForm('');
                break;
            }
            case 'Edit': {
                this.navigateToFlowForm(data.ItemKey);
                break;
            }
            case 'Delete': {
                this.showDeleteDialog(data.ItemKey);
                break;
            }
        }
    }

    navigateToFlowForm(itemKey: string) {
        if(itemKey != '') {
            this.flowsService.getFlowByID(itemKey).then(flow => {
                this.chosenFlow = flow
            });
        }
        else {
            this.chosenFlow = {
                Name: '',
                Params: [],
                Steps: [],
                Description:''
            };
        }
    }

    showDeleteDialog(objID: string) {
        const dataMsg = new PepDialogData({
            title: this.translate.instant('Flows_DeleteDialogTitle'),
            actionsType: 'cancel-delete',
            content: this.translate.instant('Flows_DeleteDialogContent')
        });
        this.dialogService.openDefaultDialog(dataMsg).afterClosed()
            .subscribe(async (isDeletePressed) => {
                if (isDeletePressed) {
                    try {
                        const obj: any = {
                            Key: objID,
                            Hidden: true
                        };
                        await this.flowsService.upsertFlows(obj);
                    }
                    catch (error) {
                        const dataMsg = new PepDialogData({
                            title: this.translate.instant('Flows_DeleteFailedDialogTitle'),
                            actionsType: 'close',
                            content: this.translate.instant('Flows_DeleteFailedDialogError')
                        });
                        this.dialogService.openDefaultDialog(dataMsg);
                    }
                }
            });
    }

   

    async saveEventLogic(logicBlocks) {
        try {
            this.chosenFlow.LogicBlocks = [...logicBlocks];
            await this.flowsService.upsertFlows(this.chosenFlow);
            this.chosenFlow = null;
        }
        catch(error) {
            console.log(`cannot update event. got error ${error}`);
        }
    }

    showList() {
        this.chosenFlow = null;
    }
}
