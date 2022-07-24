import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';

import { SelectOptions } from 'shared';
import { CreateFormData } from '../../entities'
import { EventsService } from '../services/events-service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  possibleEvents: SelectOptions<string> = [];
  possibleFields: SelectOptions<string> = [];
  eventSupportsField: boolean = true;
  eventKey: string = '';
  eventField: string = '';
  isValid: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateEventComponent>,
    private translate: TranslateService,
    private eventsService: EventsService,
    private dialogService: PepDialogService,
    @Inject(MAT_DIALOG_DATA) public incoming: CreateFormData
  ) {

    if (incoming.Events.length > 0) {
      this.possibleEvents = incoming.Events.map(event => {
        return {
          key: event.EventKey,
          value: event.EventKey
        }
      });

      this.possibleFields = incoming.Fields.map(field => {
        return {
          key: field,
          value: field
        }
      })
    }
  }

  ngOnInit(): void {
  }

  eventKeyChanged(value) {
    const event = this.incoming.Events.find(event => event.EventKey === value);
    if (event) {
      this.eventSupportsField = event.SupportField;
      this.isValid = !this.eventSupportsField;
    }
    else {
      console.error(`could not find event ${value}`);
    }
  }

  createEvent() {
    const chosenEvent = this.incoming.Events.find(item => item.EventKey === this.eventKey);
    this.eventsService.upsertEvent({
      EventKey: this.eventKey,
      EventField: this.eventSupportsField ? this.eventField : '',
      EventFilter: chosenEvent?.EventFilter || '',
      LogicBlocks: [],
      AddonUUID: this.incoming.AddonUUID,
      Group: this.incoming.Group
    }).then((event => {
      this.dialogRef.close(event);
    })).catch(error => {
      console.log(`event creation failed with the following error: ${JSON.stringify(error)}`);
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
