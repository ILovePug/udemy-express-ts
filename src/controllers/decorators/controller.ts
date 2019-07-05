import 'reflect-metadata'
import { AppRouter } from '../../utili/AppRouter'
import { Methods } from './Methods'
import { MetadataKeys } from './MetadataKeys'
import {Request, Response, RequestHandler, NextFunction } from 'express';

function bodyValidators(keys: string):RequestHandler{
    return function(req: Request, res: Response, next: NextFunction){
        console.log(req.body)
        if(!req.body){
            return res.status(422).send('Invalid request');
        }

        for (const key of keys) {
            if(!req.body[key]){
                return res.status(422).send(`${key} is required`);  
            }
        }

        next();
    }

}

function errorHandlerWrapper(route: RequestHandler){
    return function(req: Request, res: Response, next: NextFunction){
        try {
            route(req, res,next)
        } catch (error) {
            const { url, method, body, params, headers } = req;
            console.log({ url, method, body, params, headers })
            console.log('error end, make sure implement error log')
            next(error);
        }
    }
}

export function controller(routePrefix:string){
    return function(target: Function){
        const router= AppRouter.getInstance();
        for (const key in target.prototype) {
            const routeHandler = target.prototype[key];
            const path: string = Reflect.getMetadata(MetadataKeys.path,target.prototype,key)
            const method: Methods = Reflect.getMetadata(MetadataKeys.method,target.prototype,key)
            //array of middlewares
            const middlewares = Reflect.getMetadata(MetadataKeys.middleware,target.prototype,key) || []
            const requiredBodyProps = Reflect.getMetadata(MetadataKeys.validator,target.prototype,key)
            let validator:RequestHandler[]= [];
            if(requiredBodyProps) validator.push(bodyValidators(requiredBodyProps)) ;
             
            if(path){
                //spread the middlewares so it can be all applied before the final router handler
                router[method](`${routePrefix}${path}`, ...middlewares,...validator, errorHandlerWrapper(routeHandler))
            }
        }
    }
}