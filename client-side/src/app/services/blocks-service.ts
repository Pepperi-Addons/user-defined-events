import { Injectable } from "@angular/core";
import { NgComponentRelation } from "@pepperi-addons/papi-sdk";
import { LogicBlockRelation } from "src/entities";
import { UtilitiesService } from './utilities-service'

@Injectable({providedIn:'root'})
export class BlocksService {

    constructor(private utilitiesService: UtilitiesService) {}

    async getAvailableBlocks(): Promise<LogicBlockRelation[]> {
        return await this.utilitiesService.papiClient.addons.data.relations.find({
            where: `RelationName='LogicBlock'`
        }) as LogicBlockRelation[]
    }

    async getLogicBlockRelation(name: string, addonUUID: string): Promise<LogicBlockRelation> {
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