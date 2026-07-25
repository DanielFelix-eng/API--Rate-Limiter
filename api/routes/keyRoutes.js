import express from 'express'
import crypto from 'crypto'
import ApiKey from '../models/apiKey.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { requireApiKey, hashKey } from '../middleware/requireApiKey.js'

const router = express.Router()

router.use(verifyToken)

router.post('/create-apiKey', async (req, res) => {
  const { name = 'default', capacity = 20, refillRate = 5 } = req.body || {}

  const rawKey = `rlk_${crypto.randomBytes(24).toString('hex')}`
  const keyHash = hashKey(rawKey)

  const apiKey = await ApiKey.create({
    owner: req.userId,
    name,
    keyHash,
    capacity,
    refillRate
  })

  res.status(201).json({
    id: apiKey._id,
    name: apiKey.name,
    capacity: apiKey.capacity,
    refillRate: apiKey.refillRate,
    key: rawKey
  })
})

router.get('/get-api', async (req, res) => {
  const keys = await ApiKey.find({ owner: req.userId }).select('-keyHash')
  res.json(keys)
})

router.delete('/delete/:id', async (req, res) => {
  await ApiKey.findOneAndDelete({ _id: req.params.id, owner: req.userId })
  res.json({ message: 'API key deleted' })
})

export default router