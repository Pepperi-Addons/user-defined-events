import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { PepRemoteLoaderOptions } from '@pepperi-addons/ngx-lib/remote-loader';

import { LogicBlock } from 'shared';
import { BlocksService } from '../../services/blocks-service';
import { BlockConfigurationLoaderService } from '../../services/block-configuration-loader-service';

@Component({
  selector: 'block-configuration-loader',
  templateUrl: './block-configuration-loader.component.html',
  styleUrls: ['./block-configuration-loader.component.scss']
})
export class BlockConfigurationLoaderComponent implements OnInit {
  
  @ViewChild('dialogTemplate', { static: true, read: TemplateRef }) dialogTemplate!: TemplateRef<any>;

  remotePathOptions: PepRemoteLoaderOptions;

  @Input() dialogRef: MatDialogRef<any>;
  @Input() hostObject: any;
  @Input() logicBlock: LogicBlock;
  
  @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();
 
  constructor(private blocksService: BlocksService,
    private editorLoaderService:BlockConfigurationLoaderService) { }

  ngOnInit(): void {
    this.blocksService.getLogicBlockRelation(this.logicBlock.Relation.Name, this.logicBlock.Relation.AddonUUID).then(async(relation) => {
      if (relation) {
        this.remotePathOptions = await this.editorLoaderService.getRemoteOptions(relation);
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
        case 'get-configuration': {
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
