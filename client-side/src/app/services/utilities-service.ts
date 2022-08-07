import { Injectable } from "@angular/core";
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { PepJwtHelperService, PepSessionService } from "@pepperi-addons/ngx-lib";
import { InstalledAddon, PapiClient } from "@pepperi-addons/papi-sdk";

import { config } from "../addon.config";

@Injectable({providedIn:'root'}) 
export class UtilitiesService {
    
    // This subject is for is grabbing mode.
    private _isGrabbingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    get isGrabbingChange$(): Observable<boolean> {
        return this._isGrabbingSubject.asObservable().pipe(distinctUntilChanged());
    }
    
    private accessToken = '';
    private papiBaseURL = '';
    
    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.accessToken,
            addonUUID: config.AddonUUID,
            suppressLogging: true
        })
    }
    
    constructor(
        private sessionService: PepSessionService,
        private jwtHelperService: PepJwtHelperService) {
            this.accessToken = this.sessionService.getIdpToken();
            const parsedToken = this.jwtHelperService.decodeToken(this.accessToken);
            this.papiBaseURL = parsedToken["pepperi.baseurl"];
    }

    async getInstalledAddon(addonUUID:string): Promise<InstalledAddon> {
        return await this.papiClient.addons.installedAddons.addonUUID(addonUUID).get();
    }

    private changeCursorOnDragStart() {
        document.body.classList.add('inheritCursors');
        document.body.style.cursor = 'grabbing';
        this._isGrabbingSubject.next(true);
    }

    private changeCursorOnDragEnd() {
        document.body.classList.remove('inheritCursors');
        document.body.style.cursor = 'unset';
        this._isGrabbingSubject.next(false);
    }
    
    onDragStart(event: CdkDragStart) {
        this.changeCursorOnDragStart();
    }

    onDragEnd(event: CdkDragEnd) {
        this.changeCursorOnDragEnd();
    }
}