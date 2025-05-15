import { createClient } from 'redis';

// Create the Redis client
const client = createClient({
    username: 'default', 
    password: 'FAjrR18AWw0M7HIP3x0wHFpn3wU6CuF4', // Your Redis password
    socket: {
        host: 'redis-12946.c341.af-south-1-1.ec2.redns.redis-cloud.com', 
        port: 12946, 
    },
    retry_strategy: (options) => {
        // Retry if error is ECONNREFUSED
        if (options.error && options.error.code === 'ECONNREFUSED') {
            console.log('Redis connection refused.');
            return new Error('The server refused the connection');
        }

        // Stop retrying after 1 hour
        if (options.total_retry_time > 1000 * 60 * 60) {
            console.log('Retry time exhausted.');
            return new Error('Retry time exhausted');
        }

        // Stop retrying after 10 attempts
        if (options.attempt > 10) {
            console.log('Max retry attempts reached.');
            return undefined;
        }

        // Exponential backoff for retries
        return Math.min(options.attempt * 100, 3000);
    }
});

// Handle errors
client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

// Handle successful connection
client.connect()
    .then(() => {
        console.log('Connected to Redis');
    })
    .catch((err) => {
        console.error('Error connecting to Redis:', err);
    });

// Export the client to be used in your controllers
export default client;
