import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import User from '../models/User'
import UserInterface from '../interfaces/UserInterface'

export class AuthController {
  public async auth (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    return User
      .findOne({ email })
      .select('_id name +password')
      .then(async (user: UserInterface) => {
        if (user) {
          const verifier = await bcrypt.compare(password, user.password)

          if (!verifier) {
            return res.status(500).json({
              name: 'InvalidPassword',
              message: 'Authentication failed.'
            })
          }

          return res.json({
            id: user.id,
            name: user.name,
            token: await user.generateToken()
          })
        }
      })
      .catch(err => res.status(500).json({
        name: err.name,
        message: err.errmsg ? err.errmsg : 'Authentication failed.'
      }))
  }
}

export default new AuthController()
