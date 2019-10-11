import fs from 'fs'
import https from 'https'
import app from './app'

const { useHTTPS, sslPrivateKey, sslCert } = process.env
const port = process.env.PORT || 3000
const portHTTPS = process.env.PORT_HTTPS || 3001

if (useHTTPS === 'true') {
  // eslint-disable-next-line
  const privateKey = fs.readFileSync(sslPrivateKey, 'utf-8')
  // eslint-disable-next-line
  const certificate = fs.readFileSync(sslCert, 'utf-8')

  const credentials = { key: privateKey, cert: certificate }
  const httpsServer = https.createServer(credentials, app)

  httpsServer.listen(portHTTPS, () => {
    console.log(`Server is running on port ${portHTTPS} (https)`)
  })
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port} (http)`)
  })
}
