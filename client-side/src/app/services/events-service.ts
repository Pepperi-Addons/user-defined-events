import jwt from 'jwt-decode'
import { Injectable } from "@angular/core";
import { PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { PapiClient } from "@pepperi-addons/papi-sdk";

import { config } from '../addon.config'
import { EventInterceptor } from 'shared';

@Injectable({providedIn:'root'})
export class EventsService {

    accessToken = '';
    parsedToken: any;
    papiBaseURL = '';

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.session.getIdpToken(),
            addonUUID: config.AddonUUID,
            suppressLogging:true
        })
    }

    constructor(
        public session:  PepSessionService,
        private pepHttp: PepHttpService
    ) {
        const accessToken = this.session.getIdpToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"];
    }

    async getEvents(): Promise<EventInterceptor[]> {
        return this.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('event_interceptor').get();
    }
    
    async upsertEvent(obj: EventInterceptor): Promise<EventInterceptor> {
        return this.papiClient.addons.api.uuid(config.AddonUUID).file('api').func('event_interceptor').post({}, obj);
    }
}