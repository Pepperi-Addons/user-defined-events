import { Injectable } from "@angular/core";

import { PepAddonService } from "@pepperi-addons/ngx-lib";

import { config } from '../addon.config'
import { EventInterceptor, Flow } from 'shared';
import { SearchBody, SearchData } from "@pepperi-addons/papi-sdk";
import { IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { API_PAGE_SIZE } from "../../entities";

@Injectable({providedIn:'root'})
export class FlowsService {

    constructor(
        private addonService: PepAddonService,
    ) { }

    async getFlows(params: IPepGenericListParams): Promise<SearchData<Flow>> {
        const pageSize = (params.toIndex - params.fromIndex) + 1 || API_PAGE_SIZE;
        const page = params.pageIndex || (params.fromIndex / pageSize) + 1 || 1;
        const body: SearchBody = {
            Fields: ['Name', 'Description', 'Key', 'CreationDateTime', 'ModificationDateTime'],
            IncludeCount: true,
            Page: page,
            PageSize: pageSize
        }

        if(params.searchString) {
            body.Where = `Name LIKE '%${params.searchString}%'`;
        }
        
        return await this.addonService.postAddonApiCall(config.AddonUUID, 'api', `flows_search`, body).toPromise();
    }
    
    async upsertFlows(obj: Flow): Promise<Flow> {
        return await this.addonService.postAddonApiCall(config.AddonUUID, 'api', 'flows', obj).toPromise();
    }

    async getFlowByID(itemKey: String): Promise<Flow> {
        return await this.addonService.getAddonApiCall(config.AddonUUID, 'api', `flow_id?key=${itemKey}`).toPromise();
    }
}