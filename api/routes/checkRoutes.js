import express from 'express'
import { checkBucket } from '../lib/token.Bucket.js'
import { requireApiKey } from '../middleware/requireApiKey.js'

const router = express.Router()

router.post('/check', requireApiKey, async (req, res) => {
  const { identifier, cost = 1 } = req.body || {}
  const { capacity, refillRate } = req.apiKeyDoc
  const bucketKey = `bucket:${req.apiKeyDoc._id}:${identifier || 'default'}`

  try {
    const { allowed, remaining } = await checkBucket(
      bucketKey,
      capacity,
      refillRate,
      cost
    )
    res.set('X-RateLimit-Limit', capacity)
    res.set('X-RateLimit-Remaining', remaining)
    if (!allowed) {
      const retryAfter = Math.ceil(cost / refillRate)
      res.set('Retry-After', retryAfter)
      return res.status(429).json({ allowed: false, remaining, limit: capacity, retryAfter })
    }
    res.json({ allowed: true, remaining, limit: capacity })
  } catch (error) {
    console.error('[check] redis failure, failing open', error.message)
    res.json({
      allowed: true,
      remaining: null,
      limit: capacity,
      degraded: true
    })
  }
})

export default router