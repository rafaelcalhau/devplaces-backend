import { NextFunction } from 'express'
import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInterface } from '../interfaces'

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    allowNull: false,
    unique: true
  },
  name: {
    type: String,
    allowNull: false
  },
  password: {
    type: String,
    allowNull: false,
    select: false
  }
}, {
  timestamps: true
})

UserSchema.methods.generateToken = function (): string {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET)
}

UserSchema.pre<UserInterface>('save', async function (next: NextFunction): Promise<void> {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  next()
})

export default mongoose.model<UserInterface>('User', UserSchema)
