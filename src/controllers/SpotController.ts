import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express'
import AuthenticatedRequest from '../interfaces/AuthenticatedRequest'
import BaseControllerInterface from '../interfaces/BaseControllerInterface'
import Spot from '../models/Spot'
import User from '../models/User'

type SpotsQuery = {
  user: string;
  technologies?: RegExp;
}

export class SpotController implements BaseControllerInterface {
  public async delete (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params
    const { userid } = req.headers

    const spot = await Spot.findOne({ _id, user: userid })

    if (!spot) {
      return res.status(400).json({ error: 'Spot not found.' })
    }

    const file = path.resolve(__dirname, '..', '..', 'uploads', spot.thumbnail)

    const deleted = await Spot
      .deleteOne({ _id })
      .then(data => {
        // eslint-disable-next-line
        fs.unlink(file, (err) => {
          if (err) console.log(err)
        })

        return data
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'Spot[delete]: Was not possible to delete the Spot.'
      }))

    return res.json({ deleted })
  }

  public async index (req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { technologies } = req.query
    const query: SpotsQuery = {
      user: req.userId
    }

    if (technologies) {
      query.technologies = new RegExp(technologies, 'i') //eslint-disable-line
    }

    const spots = await Spot.find(query).populate('user')

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
    const { userid } = req.headers
    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ error: 'User not found.' })
    }

    const { id: _id } = req.params
    const spot = await Spot.findById(_id)

    if (!spot) {
      return res.status(400).json({ error: 'Spot not found.' })
    }

    const { company, price, technologies } = req.body
    let currentThumbnail = null

    spot.company = company
    spot.price = price

    if (technologies) {
      spot.technologies = technologies.split(',').map((tech: string): string => tech.trim())
    }

    if (req.file) {
      const { filename: thumbnail } = req.file

      if (thumbnail) {
        currentThumbnail = spot.thumbnail
        spot.thumbnail = thumbnail
      }
    }

    await spot
      .save()
      .then(() => {
        if (currentThumbnail) {
          // Delete previous thumbnail
          const file = path.resolve(__dirname, '..', '..', 'uploads', currentThumbnail)

          // eslint-disable-next-line
          fs.unlink(file, (err) => {
            if (err) console.log(err)
          })
        }
      })

    return res.json(spot)
  }
}

export default new SpotController()
