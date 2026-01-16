import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import axios from 'axios';

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    }
});

const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!BUCKET || !PUBLIC_URL) {
    console.log('❌ R2 configuration missing!');
}

const uploader = {
    upload: async (source, options = {}) => {
        try {
            const response = await axios.get(source, { 
                responseType: 'arraybuffer',
                timeout: 30000 // 30 second timeout
            });
            
            const buffer = Buffer.from(response.data);
            
            // Get proper extension from content-type
            const contentType = response.headers['content-type'] || 'image/jpeg';
            const ext = contentType.split('/')[1] || 'jpg';
            
            const filename = `${options.public_id || 'file'}_${Date.now()}.${ext}`;
            const key = `${options.folder}/${filename}`;

            await r2Client.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                Body: buffer,
                ContentType: contentType, // ADDED THIS
            }));

            return {
                secure_url: `${PUBLIC_URL}/${key}`,
                public_id: filename.replace(`.${ext}`, ''),
            };
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    },

    destroy: async (publicId, options = {}) => {
        const folder = options.resource_type === 'video' ? 'product_videos' : 'product_images';
        const exts = ['.jpg', '.jpeg', '.png', '.webp', '.mp4'];
        
        for (const ext of exts) {
            try {
                await r2Client.send(new DeleteObjectCommand({
                    Bucket: BUCKET,
                    Key: `${folder}/${publicId}${ext}`,
                }));
                return { result: 'ok' };
            } catch (e) { continue; }
        }
        return { result: 'not found' };
    }
};

export default { uploader }; // UNCOMMENTED THIS