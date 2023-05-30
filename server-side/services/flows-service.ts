import { v4 as uuid } from 'uuid'
import { Client } from "@pepperi-addons/debug-server";
import { AddonData, FindOptions, SearchBody, Flow } from "@pepperi-addons/papi-sdk";
import { FlowsScheme } from "shared";
import { UtilitiesService } from "./utilities-service";

export class FlowsService {

    utilitiesService: UtilitiesService = new UtilitiesService(this.client);

    constructor(private client: Client) {}

    async find(options: FindOptions): Promise<Flow[]> {
        return await this.utilitiesService.papiClient.addons.data.uuid(this.client.AddonUUID).table(FlowsScheme.Name).find(options) as Flow[];
    }
    
    async upsert(obj: Flow): Promise<Flow> {
        if(!obj.Key) {
            obj.Key = uuid();
        }
        return await this.utilitiesService.papiClient.addons.data.uuid(this.client.AddonUUID).table(FlowsScheme.Name).upsert(obj) as Flow;
    }
    
    async findByKey(itemKey: string): Promise<AddonData> {
        return await this.utilitiesService.papiClient.addons.data.uuid(this.client.AddonUUID).table(FlowsScheme.Name).key(itemKey).get();
    }
    
    async search(body: SearchBody) {
        
        if(body.UniqueFieldList && body.UniqueFieldList.length > 0) {
            throw new Error('search by unique field is not supported');
        }

        return await this.utilitiesService.papiClient.addons.data.search.uuid(this.client.AddonUUID).table(FlowsScheme.Name).post(body);
    }

}