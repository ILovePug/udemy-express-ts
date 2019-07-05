
import { Request, Response, NextFunction } from 'express'
import { get,controller, use } from './decorators'
import { requireAuth } from '../middlewares'


@controller('')
class RootController{
    @get('/')
    getRoot(req:Request, res:Response){
        if(req.session && req.session.loggedIn){
            res.send(`
            <div>
                <div>you are logged in</div>
                <a href="/auth/logout">Logout</a>
            </div>
            `)
        } else{
            res.send(`
            <div>
                <div>you are not logged in</div>
                <a href="/auth/login">login</a>
            </div>
            `)
        }
    }

    @get('/protected')
    @use(requireAuth)
    getProtected(req:Request, res:Response){

        res.send(`im protected info`)
    }

    @get('/error')
    getTestError(req:Request, res:Response){

        throw new Error("test error")
    }
}