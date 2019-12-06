import mongoose, { Schema } from 'mongoose'
import { SpotInterface } from '../interfaces'

const SpotSchema: Schema = new Schema({
  thumbnail: {
    type: String,
    allowNull: false
  },
  company: {
    type: String,
    allowNull: false
  },
  price: {
    type: Number,
    allowNull: false
  },
  technologies: [String],
  user: {
    type: Schema.Types.ObjectId,
    allowNull: false,
    ref: 'User'
  }
}, {
  timestamps: true
})

export default mongoose.model<SpotInterface>('Spot', SpotSchema)
