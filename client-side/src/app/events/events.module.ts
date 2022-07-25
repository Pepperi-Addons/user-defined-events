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

import { EventsComponent } from './index';
import { EventsService } from '../services/events-service'
import { config } from '../addon.config';
import { CreateEventComponent } from '../create-event/create-event.component'


export const routes: Routes = [
    {
        path: '',
        component: EventsComponent
    }
];

@NgModule({
    declarations: [
        EventsComponent,
        CreateEventComponent
    ],
    imports: [
        CommonModule,
        PepGenericListModule,
        PepButtonModule,
        PepDialogModule,
        PepSelectModule,
        MatDialogModule,
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
