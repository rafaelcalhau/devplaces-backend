import { Request, Response } from 'express'
import BaseControllerInterface from '../interfaces/BaseControllerInterface'

import Booking from '../models/Booking'
import Spot from '../models/Spot'
import User from '../models/User'

export class UserBookingController implements BaseControllerInterface {
  public async delete (req: Request, res: Response): Promise<Response> {
    const { booking_id: bookingid, spot_id: spotid } = req.params

    const spot = await Spot.findById(spotid)

    if (!spot) {
      return res.status(400).json({ error: 'Spot does not exists.' })
    }

    if (spot.user.toString() !== req.headers.userId) {
      return res.status(400).json({ error: 'Invalid request.' })
    }

    const deleted = await User
      .deleteOne({ _id: bookingid, spot: spotid })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'UserBooking[delete]: Was not possible to delete the Spot.'
      }))

    return res.json({ deleted })
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const { userid } = req.params
    const { spot_id: spotid } = req.params

    const user = await User.findById(userid)

    if (!user) {
      res.status(400).json({ error: 'User does not exists.' })
    }

    const spot = await Spot.findById(spotid)

    if (!spot) {
      return res.status(400).json({ error: 'Spot does not exists.' })
    }

    const bookings = await Booking.find({ spot: spotid, user: userid })

    return res.json(bookings)
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { userid } = req.headers
    const { spot_id: spotid } = req.params
    const { date } = req.body

    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' })
    }

    const spot = await Spot.findById(spotid)

    if (!spot) {
      return res.status(400).json({ error: 'Spot does not exists.' })
    }

    const booking = await Booking
      .create({
        date,
        spot: spotid,
        user: userid
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'UserBooking[store]: Was not possible to create the Spot.'
      }))

    return res.json(booking)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { userid } = req.headers
    const { booking_id: bookingid, spot_id: spotid } = req.params
    const { approved } = req.body

    const user = await User.findById(userid)

    if (!user) {
      return res.status(400).json({ error: 'User does not exists.' })
    }

    const spot = await Spot.findById(spotid)

    if (!spot) {
      return res.status(400).json({ error: 'Spot does not exists.' })
    }

    const booking = await Booking
      .updateOne({ _id: bookingid }, { approved })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'UserBooking[update]: Was not possible to update the Spot.'
      }))

    return res.json(booking)
  }
}

export default new UserBookingController()
