import { Router } from 'express'

import SpotController from '../../controllers/SpotController'
import UserController from '../../controllers/UserController'
import UserBookingController from '../../controllers/UserBookingController'

import uploadMiddleware from '../../middlewares/upload'

export default (routes: Router): void => {
  routes
    .delete('/spots/:id', SpotController.delete)
    .delete('/spots/:spot_id/bookings/:booking_id', UserBookingController.delete)
    .get('/spots', SpotController.index)
    .get('/spots/:spot_id/bookings', UserBookingController.index)
    .post('/spots', uploadMiddleware.single('thumbnail'), SpotController.store)
    .post('/spots/:spot_id/bookings', UserBookingController.store)
    .put('/spots/:id', SpotController.update)
    .put('/spots/:spot_id/bookings/:booking_id', UserBookingController.update)

  routes
    .delete('/users/:id', UserController.delete)
    .get('/users', UserController.index)
    .get('/users/:userid/bookings', UserBookingController.index)
    .post('/users', UserController.store)
    .put('/users/:id', UserController.update)
}
