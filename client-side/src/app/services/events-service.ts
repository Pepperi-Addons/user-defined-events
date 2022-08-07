import { Injectable } from "@angular/core";

import { config } from '../addon.config'
import { EventInterceptor } from 'shared';
import { UtilitiesService } from './utilities-service';

@Injectable({providedIn:'root'})
export class EventsService {

    constructor(
        private utilitiesService: UtilitiesService
    ) { }

    async getEvents(): Promise<EventInterceptor[]> {
        return this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('event_interceptor').get();
    }
    
    async upsertEvent(obj: EventInterceptor): Promise<EventInterceptor> {
        return this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('event_interceptor').post({}, obj);
    }
}