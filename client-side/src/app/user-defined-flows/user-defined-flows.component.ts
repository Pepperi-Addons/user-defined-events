import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";


import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { ActionClickedEventData } from '../../entities';
import { BlocksService } from '../services/blocks-service';
import { FlowsService } from '../services/flows-service';
import { Flow} from '@pepperi-addons/papi-sdk';
import { CreateFlowComponent } from '../create-flow/create-flow.component';
import { FlowsListComponent } from '../flows-list/flows-list.component';

@Component({
    selector: 'user-defined-flows',
    templateUrl: './user-defined-flows.component.html',
    styleUrls: ['./user-defined-flows.component.scss']
})
export class UserDefinedFlowsComponent implements OnInit {

    flowsList: FlowsListComponent;

    @ViewChild('flowsList', {read: FlowsListComponent}) set flowsListSetter(list: FlowsListComponent) {
        if (list) {
            this.flowsList = list;
        }
    };

    constructor(
        private translate: TranslateService,
        private flowsService: FlowsService,
        private dialogService: PepDialogService,
        private activateRoute: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {

    }

    onActionClicked(data: ActionClickedEventData) {
        switch (data.ActionType) {
            case 'Add': {
                this.openCreateFlowForm();
                break;
            }
            case 'Edit': {
                this.flowsService.getFlowByID(data.ItemKey).then(flow => {
                    if(flow) {
                        this.navigateToFlowForm(flow);
                    }
                });
                break;
            }
            case 'Delete': {
                this.showDeleteDialog(data.ItemKey);
                break;
            }
        }
    }

    navigateToFlowForm(obj: Flow) {
        this.router.navigate([obj.Key], {
            relativeTo: this.activateRoute,
            queryParamsHandling: 'merge',
            state: {
                chosenFlow: obj
            }
        });
    }
    
    openCreateFlowForm() {
        const formData = { }
        const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
        dialogConfig.data = {
            content: CreateFlowComponent
        }

        this.dialogService.openDialog(CreateFlowComponent, formData, dialogConfig).afterClosed().subscribe((createdFlow: Flow)=> {
            if(createdFlow) {
                this.navigateToFlowForm(createdFlow);
            }
        })
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
                        if(this.flowsList) {
                            this.flowsList.reloadList();
                        }
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
}

