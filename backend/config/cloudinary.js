import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
});

console.log('☁️ Cloudinary configured:', {
    cloud_name: cloudinary.config().cloud_name || '❌',
    api_key: cloudinary.config().api_key ? '✅' : '❌',
});

export default cloudinary;