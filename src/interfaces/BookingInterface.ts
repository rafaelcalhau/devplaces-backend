import { Schema, Document } from 'mongoose'

export default interface BookingInterface extends Document {
  date: Date;
  approved: boolean;
  spot: {
      type: Schema.Types.ObjectId;
  };
  user: {
    type: Schema.Types.ObjectId;
  };
}
