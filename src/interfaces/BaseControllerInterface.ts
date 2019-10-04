import { RequestHandler } from 'express'

export default interface BaseControllerInterface {
    delete: RequestHandler;
    index: RequestHandler;
    store: RequestHandler;
    update: RequestHandler;
}
