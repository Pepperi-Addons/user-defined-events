import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from '.';
import { EditFlowComponent } from '../edit-flow/edit-flow.component';

import { UserDefinedFlowsComponent } from '../user-defined-flows';

// Important for single spa
@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [
    {
        path: ':settingsSectionName/:addonUUID/:slugName',
        component: SettingsComponent,
        children: [
            {
                path: '',
                component: UserDefinedFlowsComponent
            },
            {
                path: ':flow_id',
                component: EditFlowComponent
            },
            { path: '**', component: EmptyRouteComponent }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
