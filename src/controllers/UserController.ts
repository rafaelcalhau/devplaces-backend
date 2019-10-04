import { Request, Response } from 'express'
import BaseControllerInterface from '../interfaces/BaseControllerInterface'
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
    const user = await User
      .create(req.body)
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[store]: Was not possible to create the User.'
      }))

    return res.json(user)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const user = await User
      .updateOne({ _id }, { ...req.body })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'User[update]: Was not possible to update the User.'
      }))

    return res.json(user)
  }
}

export default new UserController()
