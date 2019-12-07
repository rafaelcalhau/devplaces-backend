import { Request } from 'express'
import { Server } from 'socket.io'
import { Document, Schema } from 'mongoose'

export declare interface AuthenticatedRequest extends Request {
  userId: string;
}

export declare interface BookingInterface extends Document {
  date: Date;
  approved: boolean;
  spot: SpotInterface['_id'];
  user: UserInterface['_id'];
}

export declare type BookingQueryFields = {
  spot?: string;
  user?: string;
}

export declare interface SpotInterface extends Document {
  thumbnail: string;
  company: string;
  price: number;
  technologies: string[];
  user: {
    type: Schema.Types.ObjectId | UserInterface;
  };
}

export declare interface UserInterface extends Document {
  id?: string;
  email: string;
  name: string;
  password?: string;
  generateToken(): Function;
}

export declare interface CustomExpressRequest extends Request {
  io: Server;
  connectedUsers: any; //eslint-disable-line
}
