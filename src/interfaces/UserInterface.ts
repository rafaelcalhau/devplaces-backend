import { Document } from 'mongoose'

export default interface UserInterface extends Document {
  email: string;
  name: string;
  password?: string;
  generateToken: Function;
}
