import jwt from 'jwt-decode'
import { Injectable } from "@angular/core";
import { PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";

import { config } from '../addon.config'
import { EventInterceptor } from 'shared';
import { UtilitiesService } from './utilitiles-service';

@Injectable({providedIn:'root'})
export class EventsService {

    constructor(
        public utilitiesService:  UtilitiesService,
    ) {
    }

    async getEvents(): Promise<EventInterceptor[]> {
        return this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('event_interceptor').get();
    }
    
    async upsertEvent(obj: EventInterceptor): Promise<EventInterceptor> {
        return this.utilitiesService.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('event_interceptor').post({}, obj);
    }
}