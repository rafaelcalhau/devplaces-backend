import { Router } from 'express'

import SpotController from '../../controllers/SpotController'
import UserController from '../../controllers/UserController'
import UserBookingController from '../../controllers/UserBookingController'

import AuthMiddleware from '../../middlewares/auth'
import uploadMiddleware from '../../middlewares/upload'

export default (router: Router): void => {
  router
    .use(AuthMiddleware)

  router
    .delete('/spots/:id', SpotController.delete)
    .delete('/spots/:spot_id/bookings/:booking_id', UserBookingController.delete)
    .get('/spots', SpotController.index)
    .get('/spots/:spot_id/bookings', UserBookingController.index)
    .post('/spots', uploadMiddleware.single('thumbnail'), SpotController.store)
    .post('/spots/:spot_id/bookings', UserBookingController.store)
    .put('/spots/:id', uploadMiddleware.single('thumbnail'), SpotController.update)
    .patch('/spots/:spot_id/bookings/:booking_id', UserBookingController.update)

  router
    .delete('/users/:id', UserController.delete)
    .get('/users', UserController.index)
    .get('/users/:userid/bookings', UserBookingController.index)
    .put('/users/:id', UserController.update)
}
