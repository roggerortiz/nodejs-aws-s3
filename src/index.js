import express from 'express'
import fileUpload from 'express-fileupload'
import console from 'node:console'
import { downloadFile, getFile, getFiles, getFileUrl, uploadFile } from './aws-s3.js'
import { PORT } from './config.js'

const app = express()

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp'
  })
)

app.get('/files', async (req, res) => {
  const files = await getFiles()
  return res.status(200).json(files || [])
})

app.get('/files/:fileName', async (req, res) => {
  const file = await getFile(req.params.fileName)
  return res.status(200).json(file)
})

app.get('/fileUrl/:fileName', async (req, res) => {
  const url = await getFileUrl(req.params.fileName)
  return res.status(200).json({ url })
})

app.get('/downloadFile/:fileName', async (req, res) => {
  const { fileName } = req.params
  const { Body, ContentLength, ContentType } = await downloadFile(fileName)

  res.setHeader('Content-Type', ContentType)
  res.setHeader('Content-Length', ContentLength)
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)

  return Body.pipe(res)
})

app.post('/files', async (req, res) => {
  const success = await uploadFile(req.files.file)

  if (!success) {
    return res.status(400).json({ message: 'fail to upload file' })
  }

  return res.status(200).json({ message: 'uploaded file' })
})

app.listen(PORT)

console.log(`Server ready: http://localhost:${PORT}`)
