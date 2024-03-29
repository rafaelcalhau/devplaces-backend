import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'
import routes from './routes'

class App {
    public express: express.Application

    public constructor () {
      dotenv.config({
        path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
      })

      this.express = express()
      this.express.disable('x-powered-by')
      this.express.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
      this.express.use(helmet())

      this.database()
      this.middlewares()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private database (): void {
      mongoose
        .connect(process.env.MONGODB_URI)
        .catch(err => console.log(`Connection error: ${err.message}`))
    }

    initializeRoutes (): void {
      routes(this.express)
    }
}

export default new App()
