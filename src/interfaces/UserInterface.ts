import { Document } from 'mongoose'

export default interface UserInterface extends Document {
  id?: string;
  email: string;
  name: string;
  password?: string;
  generateToken: Function;
}
