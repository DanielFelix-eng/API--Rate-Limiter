import express from 'express';
import { requireApiKey } from '../middleware/requireApiKey.js';
import { checkBucket, recordUsage } from '../lib/token.Bucket.js';

const router = express.Router();

router.post('/check', requireApiKey, async (req, res) => {
  const { identifier } = req.body || {};
  const { capacity, refillRate } = req.apiKeyDoc;
  const bucketKey = `bucket:${req.apiKeyDoc._id}:${identifier || 'default'}`;

  try {
    const { allowed, remaining } = await checkBucket(bucketKey, capacity, refillRate);
    recordUsage(req.apiKeyDoc._id).catch((err) =>
      console.error('[usage] failed to record:', err.message)
    );

    res.set('X-RateLimit-Limit', capacity);
    res.set('X-RateLimit-Remaining', remaining);

    if (!allowed) {
      const retryAfter = Math.ceil(1 / refillRate);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({ allowed: false, remaining, limit: capacity, retryAfter });
    }

    res.json({ allowed: true, remaining, limit: capacity });
  } catch (err) {
    console.error('[check] redis failure, failing open:', err.message);
    res.json({ allowed: true, remaining: null, limit: capacity, degraded: true });
  }
});

export default router;