import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepDraggableItemsModule } from '@pepperi-addons/ngx-lib/draggable-items';
import { PepCheckboxModule } from '@pepperi-addons/ngx-lib/checkbox';
import { PepIconModule } from '@pepperi-addons/ngx-lib/icon';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';

import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';

import { config } from '../addon.config';

import { UserDefinedFlowsComponent } from './index';
import { CreateEventComponent } from '../create-event/create-event.component'
import { FlowsListComponent } from '../flows-list/flows-list.component'
import { EditEventComponent } from '../edit-event/edit-event.component'
import { BlockEditorComponent } from '../edit-event/block-editor/block-editor.component';

import { BlockConfigurationLoaderService } from '../services/block-configuration-loader-service'
import { BlocksService } from '../services/blocks-service'
import { UtilitiesService } from '../services/utilities-service';
import { FlowsService } from '../services/flows-service';



export const routes: Routes = [
    {
        path: '',
        component: UserDefinedFlowsComponent
    }
];

@NgModule({
    declarations: [
        UserDefinedFlowsComponent,
        CreateEventComponent,
        EditEventComponent,
        FlowsListComponent,
        BlockEditorComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        PepGenericListModule,
        PepButtonModule,
        PepDialogModule,
        PepSelectModule,
        PepRemoteLoaderModule,
        PepTopBarModule,
        PepDraggableItemsModule,
        PepCheckboxModule,
        PepTextboxModule,
        PepIconModule,
        MatIconModule,
        MatDialogModule,
        DragDropModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) =>
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [UserDefinedFlowsComponent],
    providers: [
        TranslateStore,
        FlowsService,
        BlockConfigurationLoaderService,
        BlocksService,
        UtilitiesService
        // Add here all used services.
    ]
})
export class UserDefinedFlowsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
