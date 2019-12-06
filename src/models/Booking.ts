import mongoose, { Schema } from 'mongoose'
import { BookingInterface } from '../interfaces'

const BookingSchema: Schema = new Schema({
  date: {
    type: Date,
    allowNull: false
  },
  approved: Boolean,
  spot: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'Spot'
  },
  user: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.model<BookingInterface>('Booking', BookingSchema)
