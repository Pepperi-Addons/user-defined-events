import { Injectable } from "@angular/core";

import { PepAddonService } from "@pepperi-addons/ngx-lib";

import { config } from '../addon.config'
import { EventInterceptor } from 'shared';

@Injectable({providedIn:'root'})
export class EventsService {

    constructor(
        private addonService: PepAddonService,
    ) { }

    async getEvents(addonUUID: string, name: string): Promise<EventInterceptor[]> {
        return this.addonService.getAddonApiCall(config.AddonUUID, 'api', `event_interceptor?where='AddonUUID=${addonUUID}' And 'Name=${name}'`).toPromise();
    }
    
    async upsertEvent(obj: EventInterceptor): Promise<EventInterceptor> {
        return this.addonService.postAddonApiCall(config.AddonUUID, 'api', 'event_interceptor', obj).toPromise();
    }
}