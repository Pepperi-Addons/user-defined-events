import jwt from 'jwt-decode'
import { Injectable } from "@angular/core";
import { PepHttpService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { InstalledAddon, PapiClient } from "@pepperi-addons/papi-sdk";

import { config } from '../addon.config'

@Injectable({providedIn:'root'})
export class UtilitiesService {

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

    async getInstalledAddon(addonUUID:string): Promise<InstalledAddon> {
        return await this.papiClient.addons.installedAddons.addonUUID(addonUUID).get();
    }
}