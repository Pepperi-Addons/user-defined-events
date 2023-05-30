import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { FlowsService } from '../services/flows-service';

@Component({
  selector: 'create-flow',
  templateUrl: './create-flow.component.html',
  styleUrls: ['./create-flow.component.scss']
})
export class CreateFlowComponent implements OnInit {

  name: string = '';
  description: string = '';
  isValid: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateFlowComponent>,
    private translate: TranslateService,
    private dialogService: PepDialogService,
    private flowsService: FlowsService,
    @Inject(MAT_DIALOG_DATA) public incoming: any
  ) {

  }

  ngOnInit(): void {
  }

  nameChanged($event: any) {
    this.name = $event;
    this.isValid = $event != '';
  }

  descriptionChanged($event: any) {
    this.description = $event;
    this.isValid = $event != '';
  }

  createFlow() {
    this.flowsService.upsertFlows({
      Name: this.name,
      Params: [],
      Steps: [],
      Description: this.description
    }).then((flow => {
      this.dialogRef.close(flow);
    })).catch(error => {
      console.log(`flow creation failed with the following error: ${JSON.stringify(error)}`);
      const dialogTitle = this.translate.instant('AddDialog_Failure_Title');
      const dialogContent = this.translate.instant('AddDialog_Failure_Content');
      const dialogConfig = this.dialogService.getDialogConfig({}, 'regular');
      const dialogData: PepDialogData = {
        actionsType: 'close',
        content: dialogContent,
        title: dialogTitle,
        actionButtons: [],
        showClose: true,
        showFooter: true,
        showHeader: true
      }
      this.dialogService.openDefaultDialog(dialogData, dialogConfig);
    })
  }

  close() {
    this.dialogRef.close();
  }
}
