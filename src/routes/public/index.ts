import { Router } from 'express'

import AuthController from '@/controllers/AuthController'
import UserController from '@/controllers/UserController'

export default (router: Router): void => {
  router
    .post('/authenticate', AuthController.auth)
    .post('/users', UserController.store)
}
