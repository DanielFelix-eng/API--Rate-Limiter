

import express from 'express';
import crypto from 'crypto';
import ApiKey from '../models/apiKey.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { hashKey } from '../middleware/requireApiKey.js';
import { getUsage } from '../lib/token.Bucket.js';

const router = express.Router();
router.use(verifyToken);

router.post('/', async (req, res) => {
  const { name = 'default', capacity = 20, refillRate = 5 } = req.body || {};
  const rawKey = `rlk_${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = hashKey(rawKey);

  const apiKey = await ApiKey.create({
    owner: req.userId,
    name,
    keyHash,
    capacity,
    refillRate,
  });

  res.status(201).json({
    _id: apiKey._id,
    id: apiKey._id,
    name: apiKey.name,
    capacity: apiKey.capacity,
    refillRate: apiKey.refillRate,
    key: rawKey,
  });
});

router.get('/', async (req, res) => {
  const keys = await ApiKey.find({ owner: req.userId }).select('-keyHash');
  res.json(keys);
});

router.get('/:id/usage', async (req, res) => {
  const apiKey = await ApiKey.findOne({ _id: req.params.id, owner: req.userId });
  if (!apiKey) return res.status(404).json({ error: 'Key not found' });

  const usage = await getUsage(apiKey._id);
  res.json(usage);
});

router.delete('/:id', async (req, res) => {
  const apiKey = await ApiKey.findOne({ _id: req.params.id, owner: req.userId });
  if (!apiKey) return res.status(404).json({ error: 'Key not found' });

  apiKey.active = false;
  await apiKey.save();
  res.json({ ok: true });
});

export default router;