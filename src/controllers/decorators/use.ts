import 'reflect-metadata';
import { MetadataKeys } from './MetadataKeys'
import { RequestHandler } from 'express';


export function use(middleware: RequestHandler) {
    return function (target: any, key: string, desc: PropertyDescriptor) {
        //there might be more than one middleware, use array
        const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
        Reflect.defineMetadata(MetadataKeys.middleware, [middleware, ...middlewares], target, key);
    }
}