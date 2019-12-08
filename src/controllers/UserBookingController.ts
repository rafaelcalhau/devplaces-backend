import { Request, Response } from 'express'

import { BookingQueryFields, CustomExpressRequest } from '../interfaces'
import Booking from '../models/Booking'
import Spot from '../models/Spot'
import User from '../models/User'

export default {
  delete: async (req: Request, res: Response): Promise<Response> => {
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
  },
  index: async (req: CustomExpressRequest, res: Response): Promise<Response> => {
    const { spot_id: spotid, userid } = req.params
    const { approved } = req.query
    const fields: BookingQueryFields = {}

    if (spotid) {
      const spot = await Spot.findById(spotid)

      if (!spot) {
        return res.status(400).json({ error: 'Spot does not exists.' })
      }

      fields.spot = spotid
    }

    if (userid) {
      const user = await User.findById(userid)

      if (!user) {
        return res.status(400).json({ error: 'User does not exists.' })
      }

      fields.user = userid
    }

    if (approved) {
      if (approved === 'true') {
        fields.approved = true
      } else if (approved === 'false') {
        fields.approved = false
      } else {
        fields.approved = undefined
      }
    }

    const bookings = await Booking.find(fields).populate('spot').populate('user')

    return res.json(bookings)
  },
  store: async (req: CustomExpressRequest, res: Response): Promise<Response> => {
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
      .then(async doc => {
        const book = await doc.populate('spot').populate('user').execPopulate()
        const socketOwner = req.connectedUsers.web[book.spot.user]

        if (socketOwner) {
          req.io.to(socketOwner).emit('booking_request', book)
        }
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'UserBooking[store]: Was not possible to create the Spot.'
      }))

    return res.json(booking)
  },
  update: async (req: CustomExpressRequest, res: Response): Promise<Response> => {
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

    return Booking.findOne({ _id: bookingid })
      .populate('spot')
      .populate('user')
      .then(async booking => {
        booking.approved = approved

        const socketOwner = req.connectedUsers.mobile[booking.user._id]

        if (socketOwner) {
          req.io.to(socketOwner).emit('booking_response', {
            id: bookingid,
            company: booking.spot.company,
            date: booking.date,
            approved
          })
        }

        await booking.save()
        return res.json({ approved: booking.approved })
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'UserBooking[update]: Was not possible to update the Spot.'
      }))
  }
}
