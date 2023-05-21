import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { PepAddonService } from '@pepperi-addons/ngx-lib';

import { config } from '../addon.config';
import { UserDefinedFlowsModule } from '../user-defined-flows';

import { SettingsComponent } from '.';
import { SettingsRoutingModule } from './settings.routes';

@NgModule({
    declarations: [
        SettingsComponent,
    ],
    imports: [
        SettingsRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        UserDefinedFlowsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
})
export class SettingsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
