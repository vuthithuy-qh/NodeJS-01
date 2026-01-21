const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', (err) => {
    console.log('Redis error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

(async () => {
    await client.connect();
})();

module.exports = client;
