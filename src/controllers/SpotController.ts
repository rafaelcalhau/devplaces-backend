import { Request, Response } from 'express'
import BaseControllerInterface from '../interfaces/BaseControllerInterface'
import Spot from '../models/Spot'
import User from '../models/User'

export class SpotController implements BaseControllerInterface {
  public async delete (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const deleted = await Spot
      .deleteOne({ _id })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'Spot[delete]: Was not possible to delete the Spot.'
      }))

    return res.json({ deleted })
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const { technologies } = req.query
    const spots = await Spot.find({ technologies }).populate('user')

    return res.json(spots)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { userid: _id } = req.headers
    const { filename: thumbnail } = req.file
    const { company, price, technologies } = req.body
    const techs = technologies.split(',').map((tech: string) => tech.trim())

    const user = await User.findById(_id)

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' })
    }

    return Spot
      .create({ company, price, thumbnail, technologies: techs, user: _id })
      .then(async doc => {
        await doc.populate('user').execPopulate()
        return res.json(doc)
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'Spot[store]: Was not possible to create a Spot.'
      }))
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const spot = await Spot
      .updateOne({ _id }, { ...req.body })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'Spot[update]: Was not possible to update the Spot.'
      }))

    return res.json(spot)
  }
}

export default new SpotController()
