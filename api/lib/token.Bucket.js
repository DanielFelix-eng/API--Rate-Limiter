import Redis from 'ioredis'

let redis

const redisUrl = process.env.REDIS_URL
console.log('[redis] REDIS_URL from env:', redisUrl ? 'set' : 'NOT SET')

if (redisUrl && redisUrl.trim() !== '') {
  // Parse the REDIS_URL for Upstash format
  // Upstash URL format: rediss://:TOKEN@HOST:PORT
  let connectionUrl = redisUrl
  let token = undefined
  
  // For Upstash, extract token from URL if present
  if (redisUrl.startsWith('rediss://:')) {
    // Format: rediss://:TOKEN@HOST:PORT
    const match = redisUrl.match(/^rediss:\/\/:(.+)@(.+)$/)
    if (match) {
      token = match[1]
      connectionUrl = `rediss://${match[2]}`
    }
  }
  
  console.log('[redis] Connecting to:', connectionUrl)
  
  redis = new Redis(connectionUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null
      return Math.min(times * 100, 3000)
    },
    password: token,
    tls: {}
  })

  redis.on('error', (err) => console.error('[redis] error:', err.message))
  redis.on('connect', () => console.log('[redis] connected'))
} else {
  console.warn('[redis] REDIS_URL not configured, rate limiting will fail open')
  redis = {
    eval: async () => [1, 999],
    on: () => {},
  }
}

const TOKEN_BUCKET_SCRIPT = `
  local key = KEYS[1]
  local capacity = tonumber(ARGV[1])
  local refillRate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  local requested = tonumber(ARGV[4])

  local bucket = redis.call('HMGET', key, 'tokens', 'timestamp')
  local tokens = tonumber(bucket[1])
  local timestamp = tonumber(bucket[2])

  if tokens == nil then
    tokens = capacity
    timestamp = now
  end

  local elapsed = math.max(0, now - timestamp)
  local refill = (elapsed / 1000) * refillRate
  tokens = math.min(capacity, tokens + refill)

  local allowed = 0
  if tokens >= requested then
    tokens = tokens - requested
    allowed = 1
  end

  redis.call('HMSET', key, 'tokens', tokens, 'timestamp', now)
  redis.call('EXPIRE', key, math.ceil(capacity / refillRate + 1))

  return {allowed, tokens}
`

export async function checkBucket(bucketKey, capacity, refillRate, cost = 1) {
  if (!redis) throw new Error('Redis not initialized')
  const now = Date.now()
  const [allowed, remaining] = await redis.eval(
    TOKEN_BUCKET_SCRIPT,
    1,
    bucketKey,
    capacity,
    refillRate,
    now,
    cost
  )
  return { allowed: allowed === 1, remaining: Math.floor(remaining) }
}

export { redis }