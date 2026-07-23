import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL)

redis.on('error', (err) => console.error('[redis] error:', err.message))

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
export async function checkBucket  (bucketKey , 
     capacity ,refillRate  ,cost=  1
) {
    const now =  Date.now()
     const [allowed  ,remaining] = await  redis.eval(

        TOKEN_BUCKET_SCRIPT ,
         1, 
         bucketKey, 
         capacity , 
         refillRate ,
          now, 
          cost 
     )
      return  {allowed  : allowed === 1 ,remaining :Math.floor(remaining)}
}

