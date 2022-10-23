import fs from 'fs'
import http from 'http'
import https from 'https'
import { Server } from 'socket.io'

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

  io = new Server(httpsServer)
} else {
  const httpServer = http.createServer(server)

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port} (http)`)
  })

  io = new Server(httpServer)
}

// On production, we should use a reliable in-memory storage like Redis to store the connections
const connectedUsers: any = {
  mobile: {},
  web: {}
}

io.on('connection', socket => {
  const { userId, type } = socket.handshake.query

  if (type === 'mobile') {
    connectedUsers.mobile[userId as string] = socket.id //eslint-disable-line
  } else if (type === 'web') {
    connectedUsers.web[userId as string] = socket.id //eslint-disable-line
  }

  console.log(connectedUsers)
})

server.use((req: CustomExpressRequest, res, next) => {
  req.io = io
  req.connectedUsers = connectedUsers

  next()
})

app.initializeRoutes()
