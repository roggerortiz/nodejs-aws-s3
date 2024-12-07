import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import fs from 'node:fs'
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js'

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
})

export const getFiles = async () => {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME
  })
  const result = await client.send(command)
  return result.Contents ?? []
}

export const getFile = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName
  })
  const result = await client.send(command)
  return result.$metadata
}

export const getFileUrl = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName
  })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}

export const downloadFile = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName
  })
  return client.send(command)
}

export const uploadFile = async (file) => {
  const stream = fs.createReadStream(file.tempFilePath)

  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream
  })
  const result = await client.send(command)

  fs.unlink(file.tempFilePath, () => {})

  return result.$metadata.httpStatusCode === 200
}
