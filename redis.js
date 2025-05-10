import { createClient } from 'redis';

// Create the Redis client
const client = createClient({
    username: 'default', 
    password: 'FAjrR18AWw0M7HIP3x0wHFpn3wU6CuF4', // Your Redis password
    socket: {
        host: 'redis-12946.c341.af-south-1-1.ec2.redns.redis-cloud.com', 
        port: 12946, 
    }
});

// Handle errors
client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

// Handle client connection
client.connect().catch((err) => {
    console.error('Error connecting to Redis:', err);
});

export default client;
