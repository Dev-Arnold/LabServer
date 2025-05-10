import Redis from 'ioredis';
const redis = new Redis({
    host:"localhost",
//   host: 'redis-12946.c341.af-south-1-1.ec2.redns.redis-cloud.com:12946', 
  port: 6379, 
//   password="FAjrR18AWw0M7HIP3x0wHFpn3wU6CuF4"       
});

export default redis;