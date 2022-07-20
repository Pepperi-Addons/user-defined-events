import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { PepPageLayoutModule} from '@pepperi-addons/ngx-lib/page-layout'
import { PepTopBarModule} from '@pepperi-addons/ngx-lib/top-bar'
import { PepSizeDetectorModule} from '@pepperi-addons/ngx-lib/size-detector'

import { EventsComponent } from './index';

import { config } from '../addon.config';

export const routes: Routes = [
    {
        path: '',
        component: EventsComponent
    }
];

@NgModule({
    declarations: [EventsComponent],
    imports: [
        CommonModule,
        PepPageLayoutModule,
        PepTopBarModule,
        PepSizeDetectorModule,
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
