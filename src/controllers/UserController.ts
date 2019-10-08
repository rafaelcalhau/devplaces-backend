import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import BaseControllerInterface from '../interfaces/BaseControllerInterface'
import { DataCreate, DataUpdate } from '../interfaces/UserInterface'
import Spot from '../models/Spot'
import User from '../models/User'

export class UserController implements BaseControllerInterface {
  public async delete (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const deleted = await User
      .deleteOne({ _id })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[delete]: Was not possible to delete the User.'
      }))

    return res.json({ deleted })
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find()

    return res.json(users)
  }

  public async spots (req: Request, res: Response): Promise<Response> {
    const { id: user } = req.params
    const spots = await Spot.find({ user })

    return res.json(spots)
  }

  public async store (req: Request, res: Response): Promise<Response> {
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
    userData.password = data.passsord

    const user = await User
      .create(userData)
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[store]: Was not possible to create the User.'
      }))

    return res.json(user)
  }

  public async update (req: Request, res: Response): Promise<Response> {
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

export default new UserController()
