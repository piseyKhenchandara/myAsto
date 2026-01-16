// Migration Script: Cloudinary → Cloudflare R2
// For Asto Gear E-commerce Platform

import axios from 'axios';
import https from 'https';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// ========================================
// CONFIGURATION
// ========================================

const R2_CONFIG = {
  accountId: 'e0e73fb3c4a725ebf711bc7e8aef4731',
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: 'astogear_r2',
  publicUrl: 'https://pub-25f9ac3bf1d6d5ef523ffae53c9fd6ca.r2.dev',
  endpoint: 'https://e0e73fb3c4a725ebf711bc7e8aef4731.r2.cloudflarestorage.com'
};

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
};

// ========================================
// HTTPS AGENT WITH SSL WORKAROUND
// ========================================

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // TEMPORARY: Bypass SSL verification
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
  keepAlive: true,
  maxSockets: 50,
});

// ========================================
// AWS SIGNATURE V4 HELPER
// ========================================

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// ========================================
// DIRECT R2 UPLOAD
// ========================================

async function uploadToR2Direct(buffer, fileName, contentType) {
  try {
    const method = 'PUT';
    const service = 's3';
    const region = 'auto';
    const host = `${R2_CONFIG.accountId}.r2.cloudflarestorage.com`;
    const endpoint = `https://${host}`;
    const bucket = R2_CONFIG.bucketName;
    const key = `products/${fileName}`;
    const url = `${endpoint}/${bucket}/${key}`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    const payloadHash = sha256(buffer);
    const canonicalUri = `/${bucket}/${key}`;
    const canonicalQuerystring = '';
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`;

    const signingKey = getSignatureKey(R2_CONFIG.secretAccessKey, dateStamp, region, service);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authorizationHeader = `${algorithm} Credential=${R2_CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await axios.put(url, buffer, {
      headers: {
        'Host': host,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authorizationHeader,
        'Content-Type': contentType,
        'Content-Length': buffer.length
      },
      httpsAgent: httpsAgent, // Use the custom HTTPS agent
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 60000
    });

    if (response.status === 200) {
      return `${R2_CONFIG.publicUrl}/products/${fileName}`;
    }
    
    return null;
  } catch (error) {
    console.error(`   ❌ Upload failed: ${error.message}`);
    if (error.response) {
      console.error(`   Response status: ${error.response.status}`);
      console.error(`   Response data:`, error.response.data);
    }
    return null;
  }
}

// ========================================
// DATABASE FUNCTIONS
// ========================================

async function getDatabaseConnection() {
  try {
    const connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

async function getAllCloudinaryImages(connection) {
  try {
    const [rows] = await connection.execute(
      'SELECT id, image_url, public_id, product_id, is_main FROM product_images WHERE image_url LIKE "%cloudinary%"'
    );
    console.log(`\n📊 Found ${rows.length} images to migrate\n`);
    return rows;
  } catch (error) {
    console.error('❌ Failed to fetch images:', error.message);
    throw error;
  }
}

async function updateImageUrl(connection, id, newUrl) {
  try {
    await connection.execute(
      'UPDATE product_images SET image_url = ? WHERE id = ?',
      [newUrl, id]
    );
  } catch (error) {
    console.error(`❌ Failed to update database for image ID ${id}:`, error.message);
    throw error;
  }
}

// ========================================
// IMAGE FUNCTIONS
// ========================================

async function downloadImage(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`   ❌ Download failed: ${error.message}`);
    return null;
  }
}

function getContentType(url) {
  const ext = url.split('.').pop().toLowerCase().split('?')[0];
  const contentTypeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif'
  };
  return contentTypeMap[ext] || 'image/jpeg';
}

function extractFileName(url, publicId) {
  if (publicId && publicId !== 'NULL') {
    const ext = url.split('.').pop().toLowerCase().split('?')[0];
    return `${publicId.replace(/\//g, '_')}.${ext}`;
  }
  
  const urlParts = url.split('/');
  const fileNameWithExt = urlParts[urlParts.length - 1].split('?')[0];
  return fileNameWithExt;
}

// ========================================
// MIGRATION STATISTICS
// ========================================

class MigrationStats {
  constructor() {
    this.total = 0;
    this.success = 0;
    this.failed = 0;
    this.skipped = 0;
    this.startTime = Date.now();
    this.failedImages = [];
  }

  addFailure(id, url, error) {
    this.failedImages.push({ id, url, error });
  }

  printSummary() {
    const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Images:     ${this.total}`);
    console.log(`✅ Successful:    ${this.success}`);
    console.log(`❌ Failed:        ${this.failed}`);
    console.log(`⏭️  Skipped:       ${this.skipped}`);
    console.log(`⏱️  Total Time:    ${totalTime}s`);
    console.log(`📈 Average Rate:  ${(this.total / totalTime).toFixed(2)} images/sec`);
    
    if (this.failedImages.length > 0) {
      console.log('\n❌ Failed Images:');
      this.failedImages.forEach(({ id, url, error }) => {
        console.log(`   ID: ${id} | URL: ${url.substring(0, 50)}... | Error: ${error}`);
      });
    }
    console.log('='.repeat(60) + '\n');
  }
}

// ========================================
// MAIN MIGRATION FUNCTION
// ========================================

async function migrateImages(dryRun = false) {
  const stats = new MigrationStats();
  let connection;

  try {
    connection = await getDatabaseConnection();
    const images = await getAllCloudinaryImages(connection);
    stats.total = images.length;

    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made\n');
    }

    console.log('🚀 Starting migration...\n');

    for (let i = 0; i < images.length; i++) {
      const { id, image_url, public_id, product_id, is_main } = images[i];
      const progress = i + 1;

      console.log(`[${progress}/${images.length}] Processing Image ID: ${id}`);
      console.log(`   Product ID: ${product_id} | Main: ${is_main ? 'Yes' : 'No'}`);
      console.log(`   URL: ${image_url.substring(0, 80)}...`);

      try {
        const fileName = extractFileName(image_url, public_id);
        console.log(`   Filename: ${fileName}`);

        console.log(`   ⬇️  Downloading...`);
        const buffer = await downloadImage(image_url);
        if (!buffer) {
          stats.failed++;
          stats.addFailure(id, image_url, 'Download failed');
          console.log(`   ❌ Failed to download\n`);
          continue;
        }

        const sizeKB = (buffer.length / 1024).toFixed(2);
        console.log(`   ✅ Downloaded (${sizeKB} KB)`);

        if (dryRun) {
          console.log(`   🔍 DRY RUN: Would upload to R2 as: products/${fileName}`);
          stats.success++;
          console.log(`   ✅ Dry run success\n`);
          continue;
        }

        console.log(`   ⬆️  Uploading to R2...`);
        const contentType = getContentType(image_url);
        const newUrl = await uploadToR2Direct(buffer, fileName, contentType);
        
        if (!newUrl) {
          stats.failed++;
          stats.addFailure(id, image_url, 'Upload failed');
          console.log(`   ❌ Failed to upload\n`);
          continue;
        }

        console.log(`   ✅ Uploaded successfully`);
        console.log(`   💾 Updating database...`);
        await updateImageUrl(connection, id, newUrl);
        console.log(`   ✅ Database updated`);
        console.log(`   🎉 New URL: ${newUrl}\n`);

        stats.success++;
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        stats.failed++;
        stats.addFailure(id, image_url, error.message);
        console.error(`   ❌ Error: ${error.message}\n`);
      }
    }

    stats.printSummary();
    await connection.end();
    console.log('✅ Database connection closed\n');

    return stats;

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    if (connection) await connection.end();
    throw error;
  }
}

// ========================================
// RUN MIGRATION
// ========================================

console.log('\n' + '='.repeat(60));
console.log('🚀 CLOUDINARY → R2 MIGRATION TOOL');
console.log('   Asto Gear E-commerce Platform');
console.log('='.repeat(60));
console.log('⚠️  SSL verification temporarily disabled for Windows compatibility\n');

const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('🔍 DRY RUN MODE\n');
}

if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error('❌ Error: R2 credentials not found');
  process.exit(1);
}

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('❌ Error: Database credentials not found');
  process.exit(1);
}

migrateImages(isDryRun)
  .then((stats) => {
    if (stats.failed === 0) {
      console.log('🎉 Migration completed successfully!\n');
      process.exit(0);
    } else {
      console.log('⚠️  Migration completed with errors\n');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  });