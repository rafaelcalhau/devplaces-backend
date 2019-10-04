import { Schema, model } from 'mongoose'
import BookingInterface from '../interfaces/BookingInterface'

const BookingSchema: Schema<BookingInterface> = new Schema({
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

export default model<BookingInterface>('Booking', BookingSchema)
