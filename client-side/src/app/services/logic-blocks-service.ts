import { ComponentFactoryResolver, Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PepAddonService } from "@pepperi-addons/ngx-lib";
import { PepDialogService } from "@pepperi-addons/ngx-lib/dialog";
import { NgComponentRelation } from "@pepperi-addons/papi-sdk";
import { UtilitiesService } from "./utilitiles-service";

@Injectable({providedIn: 'root'})
export class LogicBlocksService {


    constructor(
        private route:ActivatedRoute,
        private utilitiesService: UtilitiesService,
        private addonService: PepAddonService,
        private resolver: ComponentFactoryResolver,
        private dialogService: PepDialogService,
    ) { }



    async getLogicBlocks(addonUUID: string): Promise<NgComponentRelation[]> {
        return await this.utilitiesService.papiClient.addons.data.relations.find({
            where: `RelationName=LogicBlock AND AddonUUID='${addonUUID}'`
        })
    }
    
    async getLogicBlockRelation(name: string, addonUUID: string): Promise<NgComponentRelation> {
        let result = undefined;
        const relations = await this.utilitiesService.papiClient.addons.data.relations.find({
            where: `RelationName=LogicBlock AND AddonUUID='${addonUUID}' And Name='${name}'`
        })
        if (relations.length > 0) {
            result = relations[0];
        }
        return result
    }

    
}