import { Client } from "@pepperi-addons/debug-server";
import { AddonData, FindOptions, SearchBody } from "@pepperi-addons/papi-sdk";
import { EventsInterceptorsScheme, EventInterceptor } from "shared";
import { UtilitiesService } from "./utilities-service";

export class EventsService {

    utilitiesService: UtilitiesService = new UtilitiesService(this.client);

    constructor(private client: Client) {}

    async find(options: FindOptions): Promise<EventInterceptor[]> {
        return await this.utilitiesService.papiClient.addons.data.uuid(this.client.AddonUUID).table(EventsInterceptorsScheme.Name).find(options) as EventInterceptor[];
    }
    
    async upsert(obj: EventInterceptor): Promise<EventInterceptor> {
        if(!obj.Key) {
            obj.Key = this.getObjectKey(obj);
        }
        return await this.utilitiesService.papiClient.addons.data.uuid(this.client.AddonUUID).table(EventsInterceptorsScheme.Name).upsert(obj) as EventInterceptor;
    }
    
    async findByKey(itemKey: string): Promise<AddonData> {
        return await this.utilitiesService.papiClient.addons.data.uuid(this.client.AddonUUID).table(EventsInterceptorsScheme.Name).key(itemKey).get();
    }
    
    async search(body: SearchBody) {
        let whereClause = '';
        if(!body.Where) {
            if (body.KeyList && body.KeyList.length > 0) {
                whereClause = this.getWhereClaus('Key', body.KeyList);
            }
            else if(body.UniqueFieldList && body.UniqueFieldList.length > 0) {
                throw new Error('search by unique field is not supported');
            }
        }
        else {
            whereClause = body.Where;
        }
        console.log(`whereClause is: ${whereClause}`);
        const options: FindOptions = {
            where: whereClause,
        }
        if (body.Fields) {
            options.fields = body.Fields;
        }
        if (body.Page) {
            options.page = body.Page;
        }
        if (body.PageSize) {
            options.page_size = body.PageSize;
        }
        return await this.find(options);
    }

    getWhereClaus(fieldID: string, fieldValues: string[]): string{
        return fieldValues.reduce((previous, current, index) => {
            const clause = `${fieldID}='${current}'`;
            return index == 1 ? `${fieldID}='${previous}' OR ${clause}` : `${previous} OR ${clause}`;
        });
    }

    async migrateInterceptors() {
        const interceptors = await this.find({});
        try {
            // iterate over all interceptors in the table, are change the key for the object
            for await (const interceptor of interceptors) {
                interceptor.Hidden = true;
                // delete the old interceptor
                await this.upsert(interceptor);

                // delete the Key so the upsert will build the key again
                delete interceptor.Key;
                interceptor.Hidden = false;
                await this.upsert(interceptor);
            }
        }
        catch (err) {
            console.error('could not migrate interceptors. got error', err);
            throw err;
        }
    }

    getObjectKey(obj: EventInterceptor) {
        let key = `${obj.AddonUUID}_${obj.Name}_${obj.EventKey}`;
        // field events are not unique, we need to add the field to make it unique
        if (obj.EventField) { 
            key = `${key}_${obj.EventField}`;
        }
        return key;
    }
}