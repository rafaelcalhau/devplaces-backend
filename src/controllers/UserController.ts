import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import Spot from '../models/Spot'
import User from '../models/User'

interface DataCreate {
  email: string;
  name: string;
  password: string;
}

interface DataUpdate {
  email: string;
  name: string;
  password?: string;
}

export default {
  delete: async (req: Request, res: Response): Promise<Response> => {
    const { id: _id } = req.params
    const deleted = await User
      .deleteOne({ _id })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[delete]: Was not possible to delete the User.'
      }))

    return res.json({ deleted })
  },
  index: async (req: Request, res: Response): Promise<Response> => {
    const users = await User.find()

    return res.json(users)
  },
  spots: async (req: Request, res: Response): Promise<Response> => {
    const { id: user } = req.params
    const spots = await Spot.find({ user })

    return res.json(spots)
  },
  store: async (req: Request, res: Response): Promise<Response> => {
    const data = { ...req.body }
    const userData: DataCreate = {
      name: '',
      email: '',
      password: ''
    }

    if (!data.name || !data.email || !data.password) {
      return res.status(500).json({
        name: 'UnvalidUserData',
        message: 'The data sent is not expected.'
      })
    }

    userData.name = data.name
    userData.email = data.email
    userData.password = data.password

    const user = await User
      .create(userData)
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[store]: Was not possible to create the User.'
      }))

    return res.json(user)
  },
  update: async (req: Request, res: Response): Promise<Response> => {
    const { id: _id } = req.params
    const data = { ...req.body }
    const userData: DataUpdate = {
      name: '',
      email: ''
    }

    if (!data.name || !data.email) {
      return res.status(500).json({
        name: 'UnvalidUserData',
        message: 'The data sent is not expected.'
      })
    }

    userData.name = data.name
    userData.email = data.email

    if (data.password) {
      userData.password = await bcrypt.hash(req.body.password, 8)
    }

    const user = await User
      .updateOne({ _id }, userData)
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[update]: Was not possible to update the User.'
      }))

    return res.json(user)
  }
}
