import { Document } from 'mongoose'

export interface DataCreate {
  email: string;
  name: string;
  password: string;
}

export interface DataUpdate {
  email: string;
  name: string;
  password?: string;
}

export default interface UserInterface extends Document {
  id?: string;
  email: string;
  name: string;
  password?: string;
  generateToken: Function;
}
