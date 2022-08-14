import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgComponentRelation } from "@pepperi-addons/papi-sdk";

@Injectable({providedIn:'root'})
export class BlockConfigurationLoaderService {

    private _devBlocks: Map<string, string>; // Map<Component name, Host name>
    get devBlocks(): Map<string, string> {
        return this._devBlocks;
    }

    constructor(
        private route:ActivatedRoute
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
    
    getRemoteEntry(relation: NgComponentRelation) {
        let remoteBasePath = '';
        if (this.devBlocks.has(relation.ModuleName)) {
            remoteBasePath = this.devBlocks.get(relation.ModuleName);
        } else if (this.devBlocks.has(relation.ComponentName)) {
            remoteBasePath = this.devBlocks.get(relation.ComponentName);
        }
        
        return remoteBasePath;
    }
}