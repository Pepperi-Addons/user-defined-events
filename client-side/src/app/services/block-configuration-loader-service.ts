import { ComponentFactoryResolver, ComponentRef, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { IAddonBlockLoaderDialogOptions } from "@pepperi-addons/ngx-lib/remote-loader";
import { NgComponentRelation } from "@pepperi-addons/papi-sdk";

import { UtilitiesService } from "./utilities-service";
import { BlockConfigurationLoaderComponent } from '../edit-event/block-configuration-loader/block-configuration-loader.component';
import { LogicBlockEditorOptions } from "src/entities";
import { PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { MatDialogRef } from "@angular/material/dialog";

@Injectable({providedIn:'root'})
export class BlockConfigurationLoaderService {

    private _devBlocks: Map<string, string>; // Map<Component name, Host name>
    get devBlocks(): Map<string, string> {
        return this._devBlocks;
    }

    constructor(
        private route:ActivatedRoute,
        private utilitiesService: UtilitiesService,
        private addonService: PepAddonService,
        private resolver: ComponentFactoryResolver,
        private dialogService: PepDialogService,
    ) {
        this.loadDevBlocks();
    }
    
    private loadDevBlocks() {
        try {
            const devBlocksAsJSON = JSON.parse(this.route.snapshot.queryParamMap.get('devBlocks') || '{}');
            this._devBlocks = new Map(devBlocksAsJSON);
        } catch(err) {
            this._devBlocks = new Map<string, string>();
        }
    }
    
    async getRemoteEntry(relation: NgComponentRelation) {
        const installedAddon = await this.utilitiesService.getInstalledAddon(relation.AddonUUID);
        let remoteBasePath = installedAddon?.PublicBaseURL || '';
        if (this.devBlocks.has(relation.ModuleName)) {
            remoteBasePath = this.devBlocks.get(relation.ModuleName);
        } else if (this.devBlocks.has(relation.ComponentName)) {
            remoteBasePath = this.devBlocks.get(relation.ComponentName);
        } else {
            return `${remoteBasePath}${relation.AddonRelativeURL}.js`;
        }
    }
    
    async getRemoteOptions(relation: NgComponentRelation) {
        const remoteEntry = await this.getRemoteEntry(relation);
        return {
            addonId: relation.AddonUUID,
            remoteEntry: remoteEntry,
            remoteName: relation.AddonRelativeURL,
            exposedModule: `./${relation.ModuleName}`,
            componentName: relation.ComponentName, 
        }
    }

    private loadAddonBlockInternal(options: IAddonBlockLoaderDialogOptions): ComponentRef<BlockConfigurationLoaderComponent> | null {
        if (options.container !== null) {
            const factory = this.resolver.resolveComponentFactory(BlockConfigurationLoaderComponent);
            const componentRef = options.container.createComponent(factory);
            const logicBlockInstance = componentRef.instance;

            logicBlockInstance.hostObject = options.hostObject;

            logicBlockInstance.hostEvents.subscribe((event) => {
                if (options.hostEventsCallback) {
                    options.hostEventsCallback(event);
                }
            });

            return componentRef;
        } else {
            return null;
        }
    }

    loadAddonBlockInDialog(options: LogicBlockEditorOptions): MatDialogRef<any> | null {
        const componentRef = this.loadAddonBlockInternal(options);
        
        if (componentRef) {
            const logicBlockInstance = componentRef.instance;
            const pepConfig = this.dialogService.getDialogConfig({ disableClose: false, panelClass: 'remote-loader-dialog' }, options.size || 'full-screen');
            const mergeConfig = {...options.config, ...pepConfig}; 
            const data = options.data || null;
            logicBlockInstance.logicBlock = options.block;
            logicBlockInstance.dialogRef = this.dialogService.openDialog(logicBlockInstance.dialogTemplate, data, mergeConfig);
            logicBlockInstance.dialogRef.afterClosed().subscribe(() => {
                componentRef.hostView.detach();
                componentRef.hostView.destroy();
                componentRef.destroy();
            });
            return logicBlockInstance.dialogRef;

        } else {
            return null;
        }
    }
}