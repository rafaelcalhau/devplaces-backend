import { Schema, model } from 'mongoose'
import SpotInterface from '../interfaces/SpotInterface'

const SpotSchema: Schema<SpotInterface> = new Schema({
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

export default model<SpotInterface>('Spot', SpotSchema)
