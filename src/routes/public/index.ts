import { Router } from 'express'

import AuthController from '../../controllers/AuthController'
import UserController from '../../controllers/UserController'

export default (routes: Router): void => {
  routes
    .post('/authenticate', AuthController.auth)
    .post('/users', UserController.store)
}
