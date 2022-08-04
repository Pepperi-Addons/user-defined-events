import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPepButtonClickEvent } from '@pepperi-addons/ngx-lib/button';
import { LogicBlock } from 'shared';

@Component({
  selector: 'block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent implements OnInit {

  @Input() block: LogicBlock;

  @Output() deleteBlockClicked: EventEmitter<LogicBlock> = new EventEmitter<LogicBlock>();
  @Output() editBlockClicked: EventEmitter<LogicBlock> = new EventEmitter<LogicBlock>();

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteBlock(event: IPepButtonClickEvent, block: LogicBlock) {
    console.log('emitting delete block');
    this.deleteBlockClicked.emit(block);
  }

  onEditBlock(event: IPepButtonClickEvent, block: LogicBlock) {
    console.log('emitting edit block');
    this.editBlockClicked.emit(block);
  }

}
