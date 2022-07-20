import { PapiClient, InstalledAddon, AddonDataScheme, Relation } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

export class UtilitiesService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });
    }

    async createAdalTable(table: AddonDataScheme): Promise<AddonDataScheme> {
        return await this.papiClient.addons.data.schemes.post(table);
    }

    async createRelation(relation: Relation): Promise<Relation> {
        return await this.papiClient.addons.data.relations.upsert(relation);
    }
}
