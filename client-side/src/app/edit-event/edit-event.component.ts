import { CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { IPepButtonClickEvent } from '@pepperi-addons/ngx-lib/button';
import { IPepDraggableItem } from '@pepperi-addons/ngx-lib/draggable-items';
import { PepAddonBlockLoaderService } from '@pepperi-addons/ngx-lib/remote-loader';
import { EventInterceptor, LogicBlock, EventDataFields } from 'shared';
import { LogicBlockRelation } from 'src/entities';
import { BlockConfigurationLoaderService } from '../services/block-configuration-loader-service';
import { BlocksService } from '../services/blocks-service';
import { UtilitiesService } from '../services/utilities-service';

@Component({
  selector: 'edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  @Input() chosenEvent: EventInterceptor;
  @Input() availableBlocks: Array<IPepDraggableItem> = [];
  @Input() eventData: EventDataFields;

  @Output() eventLogicSaved: EventEmitter<Array<LogicBlock>> = new EventEmitter<Array<LogicBlock>>();
  @Output() backToList: EventEmitter<void> = new EventEmitter<void>()

  emptyDropAreaId = 'emptyDropArea';
  mappedFieldsId = 'mappedFields';

  constructor(
    private utilitiesService: UtilitiesService,
    private viewContainer: ViewContainerRef,
    private editorLoaderService: BlockConfigurationLoaderService,
    private addonBlockLoaderService: PepAddonBlockLoaderService,
    private blocksService: BlocksService,
  ) { }

  ngOnInit(): void {
    
  }

  private addNewField(draggableItem: IPepDraggableItem, index: number) {

    // Add new block to the event logic.
    const block: LogicBlock = {
      Name: draggableItem.title,
      Disabled: false,
      Configuration: '{}',
      ParallelExecutionGroup: NaN,
      Relation: {
        AddonUUID: draggableItem.data.addonUUID,
        Name: draggableItem.title,
        BlockExecutionRelativeURL: draggableItem.data.blockExecutionRelativeURL,
        ModuleName: draggableItem.data.moduleName,
        ComponentName: draggableItem.data.componentName,
      }
    }
    this.openBlockConfiguration(block, true, index);    
  }

  private spliceLogicBlocks(start: number, deleteCount: number, item?: LogicBlock) {
    if (item) {
      this.chosenEvent.LogicBlocks.splice(start, deleteCount, item);
    } else {
      this.chosenEvent.LogicBlocks.splice(start, deleteCount);
    }
  }

  onDragStart(event: CdkDragStart) {
    console.log('start dragging');
    this.utilitiesService.onDragStart(event);
  }

  onDragEnd(event: CdkDragEnd) {
    console.log('finished dragging');
    this.utilitiesService.onDragEnd(event);
  }

  onDropBlock(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.container.id === 'emptyDropArea') {
      this.addNewField(event.previousContainer.data[event.previousIndex], this.chosenEvent.LogicBlocks.length);
    } else {
      this.addNewField(event.previousContainer.data[event.previousIndex], event.currentIndex);
    }
  }

  onDeleteBlock(block: LogicBlock) {
    const index = this.chosenEvent.LogicBlocks.findIndex(lb => lb === block);
    if (index > -1) {
      this.spliceLogicBlocks(index, 1);
    }
  }

  async openBlockConfiguration(block: LogicBlock, shouldAdd = false, index = 0) {
      const remoteEntry = await this.editorLoaderService.getRemoteEntry(block.Relation);
      const dialogRef = this.addonBlockLoaderService.loadAddonBlockInDialog({
        container: this.viewContainer,
        name: block.Relation.Name,
        blockType: "LogicBlock",
        addonUUID: block.Relation.AddonUUID,
        blockRemoteEntry: remoteEntry,
        hostObject: {
          Configuration: block.Configuration,
          EventData: this.eventData,
        },
        hostEventsCallback: (event) => {
          if(event) {
            switch(event.type) {
              case 'close-dialog': {
                dialogRef?.close();
                break;
              }
              case 'set-configuration': {
                dialogRef?.close();
                block.Configuration = event.configuration;
                if(shouldAdd) {
                  this.spliceLogicBlocks(index, 0, block);
                }
                break;
              }
            }
          }
        },
        size:'large'
      })
  }

  goBack() {
    this.backToList.emit();
  }

  saveClicked() {
    this.eventLogicSaved.emit(this.chosenEvent.LogicBlocks);
  }
}
