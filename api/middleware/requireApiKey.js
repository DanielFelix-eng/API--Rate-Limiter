import crypto from 'crypto'
import ApiKey from '../models/apiKey.js'

function hashKey(rawKey) {
  return crypto.createHash('sha256').update(rawKey).digest('hex')
}

export async function requireApiKey(req, res, next) {
  const rawKey = req.header('x-api-key')
  if (!rawKey) {
    return res.status(401).json({
      error: 'Missing x-api-key header'
    })
  }
  const keyHash = hashKey(rawKey)
  const apiKey = await ApiKey.findOne({
    keyHash,
    active: true
  })
  if (!apiKey) {
    return res.status(403).json({
      error: 'Invalid API key'
    })
  }
  req.apiKeyDoc = apiKey
  next()
}

export { hashKey }