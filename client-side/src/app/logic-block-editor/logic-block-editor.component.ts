import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { PepRemoteLoaderOptions } from '@pepperi-addons/ngx-lib/remote-loader';
import { LogicBlock } from 'shared';
import { EditorLoaderService } from '../services/editor-loader-service';
import { LogicBlocksService } from '../services/logic-blocks-service';

@Component({
  selector: 'app-logic-block-editor',
  templateUrl: './logic-block-editor.component.html',
  styleUrls: ['./logic-block-editor.component.scss']
})
export class LogicBlockEditorComponent implements OnInit {
  
  @ViewChild('dialogTemplate', { static: true, read: TemplateRef }) dialogTemplate!: TemplateRef<any>;

  remotePathOptions: PepRemoteLoaderOptions;
  remotePathOptionsString: string = '';

  @Input() dialogRef: MatDialogRef<any>;
  @Input() hostObject: any;
  @Input() logicBlock: LogicBlock;
  
  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
 
  constructor(private logicBlocksService: LogicBlocksService,
    private editorLoaderService:EditorLoaderService) { }

  ngOnInit(): void {
    this.logicBlocksService.getLogicBlockRelation(this.logicBlock.Relation.Name, this.logicBlock.Relation.AddonUUID).then(async(relation) => {
      if (relation) {
        this.remotePathOptions = await this.editorLoaderService.getRemoteOptions(relation);
        this.remotePathOptionsString = JSON.stringify(this.remotePathOptions);
      }
    });
  }

  onHostEvents(event) {
    if(event) {
      switch(event.type) {
        case 'close-dialog': {
          this.dialogRef?.close();
          break;
        }
        case 'set-configuration': {
          console.log(`configuration obj got: ${event.configuration}`);
          this.dialogRef?.close();
          this.hostEvents.emit(event);
          break;
        }
      }
    }
  }

  onBlockLoad() {
    console.log('editor load finished');
  }

}
