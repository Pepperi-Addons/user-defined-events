import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector } from '@angular/core';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { PepAddonService } from '@pepperi-addons/ngx-lib'

import { config } from './addon.config';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';

import { SettingsModule, SettingsComponent } from './settings';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        SettingsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib', 'ngx-composite-lib']),
                deps: [PepAddonService]
            }
        }),
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        //AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    
    constructor(
        private pepAddonService: PepAddonService,
        translate: TranslateService,
        private injector: Injector
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap(): void {
        this.pepAddonService.defineCustomElement(`user-defined-flows-element-${config.AddonUUID}`, SettingsComponent, this.injector)      
    }
}
