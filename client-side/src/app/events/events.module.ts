import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepGenericListModule } from '@pepperi-addons/ngx-composite-lib/generic-list';
import { PepButtonModule } from '@pepperi-addons/ngx-lib/button';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepSelectModule } from '@pepperi-addons/ngx-lib/select';
import { MatDialogModule } from '@angular/material/dialog';

import { config } from '../addon.config';

import { EventsService } from '../services/events-service'
import { UtilitiesService } from '../services/utilitiles-service'
import { LogicBlocksService } from '../services/logic-blocks-service'
import { EditorLoaderService } from '../services/editor-loader-service'

import { CreateEventComponent } from '../create-event/create-event.component'
import { LogicBlockEditorComponent } from '../logic-block-editor/logic-block-editor.component'

import { EventsComponent } from './index';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';


export const routes: Routes = [
    {
        path: '',
        component: EventsComponent
    }
];

@NgModule({
    declarations: [
        EventsComponent,
        CreateEventComponent,
        LogicBlockEditorComponent
    ],
    imports: [
        CommonModule,
        PepGenericListModule,
        PepButtonModule,
        PepDialogModule,
        PepSelectModule,
        MatDialogModule,
        PepRemoteLoaderModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) =>
                    PepAddonService.createMultiTranslateLoader(addonService, ['ngx-lib', 'ngx-composite-lib'], config.AddonUUID),
                deps: [PepAddonService]
            }, isolate: false
        }),
        RouterModule.forChild(routes)
    ],
    exports: [EventsComponent],
    providers: [
        TranslateStore,
        EventsService,
        LogicBlocksService,
        UtilitiesService,
        EditorLoaderService,
        // Add here all used services.
    ]
})
export class EventsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
