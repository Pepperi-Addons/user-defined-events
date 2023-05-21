
import { Client, Request } from '@pepperi-addons/debug-server'
import { EventsService } from './services/events-service'
import { FlowsService } from './services/flows-service';

export async function event_interceptor(client: Client, request: Request) {
    const service = new EventsService(client);

    switch(request.method) {
        case 'GET': {
            return await service.find(request.query);
        }
        case 'POST': {
            return await service.upsert(request.body);
        }
        default: {
            const err: any = new Error(`method ${request.method} not allowed`);
            err.code = 405;
            throw err;
        }
    }
}

export async function get_event_interceptor_by_key(client: Client, request: Request) {
    const service = new EventsService(client);
    const itemKey = request.query.key;
    
    switch (request.method) {
        case 'GET': {
            return await service.findByKey(itemKey)
        }
        default: {
            let err: any = new Error(`Method ${request.method} not allowed`);
            err.code = 405;
            throw err;
        }
    }
}

export async function get_event_interceptor_by_unique_field(client: Client, request: Request) {
    let err: any = new Error(`this method is not supported by this resource`);
    err.code = 405;
    throw err;
}

export async function event_interceptor_search(client: Client, request: Request) {
    const service = new EventsService(client);
    
    switch (request.method) {
        case 'POST': {
            return await service.search(request.body);
        }
        default: {
            let err: any = new Error(`Method ${request.method} not allowed`);
            err.code = 405;
            throw err;
        }
    }

}

export async function flows(client: Client, request: Request) {
    const service = new FlowsService(client);

    switch(request.method) {
        case 'GET': {
            return await service.find(request.query);
        }
        case 'POST': {
            return await service.upsert(request.body);
        }
        default: {
            const err: any = new Error(`method ${request.method} not allowed`);
            err.code = 405;
            throw err;
        }
    }
}

export async function flow_id(client: Client, request: Request) {
    const service = new FlowsService(client);
    const itemKey = request.query.key;
    
    switch (request.method) {
        case 'GET': {
            return await service.findByKey(itemKey)
        }
        default: {
            let err: any = new Error(`Method ${request.method} not allowed`);
            err.code = 405;
            throw err;
        }
    }
}