import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, DoBootstrap, Injector } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PepAddonService } from '@pepperi-addons/ngx-lib'

import { AppComponent } from './app.component';
import { UserDefinedEventsModule, UserDefinedEventsComponent } from './user-defined-events';

import { config } from './addon.config'

@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    { path: '**', component: EmptyRouteComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        UserDefinedEventsModule,
        RouterModule.forRoot(routes),
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [
        //AppComponent
    ]
})
export class AppModule implements DoBootstrap {
    
    constructor(private pepAddonService: PepAddonService,
        private injector: Injector) {}

    ngDoBootstrap(): void {
        this.pepAddonService.defineCustomElement(`user-defined-events-element-${config.AddonUUID}`, UserDefinedEventsComponent, this.injector)      
    }
}
