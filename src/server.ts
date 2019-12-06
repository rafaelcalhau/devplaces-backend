import fs from 'fs'
import http from 'http'
import https from 'https'
import socketio, { Server } from 'socket.io'

import app from './app'
import { CustomExpressRequest } from './interfaces'

const { useHTTPS, sslPrivateKey, sslCert } = process.env
const port = process.env.PORT || 3000
const portHTTPS = process.env.PORT_HTTPS || 3001

let io: Server

const server = app.express

if (useHTTPS === 'true') {
  // eslint-disable-next-line
  const privateKey = fs.readFileSync(sslPrivateKey, 'utf-8')
  // eslint-disable-next-line
  const certificate = fs.readFileSync(sslCert, 'utf-8')

  const credentials = { key: privateKey, cert: certificate }
  const httpsServer = https.createServer(credentials, server)

  httpsServer.listen(portHTTPS, () => {
    console.log(`Server is running on port ${portHTTPS} (https)`)
  })

  io = socketio(httpsServer)
} else {
  const httpServer = http.createServer(server)

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port} (http)`)
  })

  io = socketio(httpServer)
}

// On production, a good practice is to use Redis for that.
const connectedUsers: any = {} //eslint-disable-line

io.on('connection', socket => {
  const { userId } = socket.handshake.query
  connectedUsers[userId] = socket.id //eslint-disable-line

  console.log('User connected: ', socket.id)
})

server.use((req: CustomExpressRequest, res, next) => {
  req.io = io
  req.connectedUsers = connectedUsers

  next()
})

app.initializeRoutes()
