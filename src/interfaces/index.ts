import { Server } from 'socket.io'
import { Request } from 'express'

export declare interface CustomExpressRequest extends Request {
  io: Server;
  connectedUsers: any; //eslint-disable-line
}
