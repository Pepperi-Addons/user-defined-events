
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { UtilitiesService } from './services/utilities-service';
import { FlowsScheme, FlowsAddonBlockRelation, SettingsRelation } from 'shared';
import semver from 'semver';


export async function install(client: Client, request: Request): Promise<any> {
    // For block template uncomment this.
    // const res = await createBlockRelation(client, false);
    // return res;
    return await createObjects(client);
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    // on version 0.6.x we have changed the destination of this addon and converted it to flows 
    // addon instead of events addon, so we need to create the relevant objects
    if (request.body.FromVersion && semver.compare(request.body.FromVersion, '0.6.0') < 0) {
        await createObjects(client)
    }
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

async function createObjects(client: Client) {
    try {
        const service = new UtilitiesService(client);
        await service.createAdalTable(FlowsScheme);
        await service.createRelation(FlowsAddonBlockRelation);
        await service.createRelation(SettingsRelation);
        return {
            success:true,
            resultObject: {}
        }
    } 
    catch (err) {
        return { 
            success: false, 
            resultObject: err , 
            errorMessage: `Error in creating necessary objects . error - ${JSON.stringify(err)}`
        };
    }
}