import fs from 'fs'
import https from 'https'
import path from 'path'
import app from './app'

const { useHTTPS, sslPrivateKey, sslCert } = process.env
const port = process.env.PORT || 3000

if (useHTTPS === 'true') {
  // eslint-disable-next-line
  const privateKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', sslPrivateKey), 'utf-8')
  // eslint-disable-next-line
  const certificate = fs.readFileSync(path.resolve(__dirname, '..', '..', 'ssl', sslCert), 'utf-8')

  const credentials = { key: privateKey, cert: certificate }
  const httpsServer = https.createServer(credentials, app)

  httpsServer.listen(port, () => {
    console.log(`Server is running on port ${port} (https)`)
  })
} else {
  app.listen(port, () => {
    console.log(`Server is running on port ${port} (http)`)
  })
}
