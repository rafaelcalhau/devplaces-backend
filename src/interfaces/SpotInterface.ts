import { Document, Schema } from 'mongoose'
import UserInterface from './UserInterface'

export default interface SpotInterface extends Document {
  thumbnail: string;
  company: string;
  price: number;
  technologies: [string];
  user: {
    type: Schema.Types.ObjectId | UserInterface;
  };
}
