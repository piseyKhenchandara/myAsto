import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import https from "https";

const endpoint = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const httpsAgent = new https.Agent({
  // set SKIP_R2_SSL_VERIFY=true in backend/.env to disable strict SSL (only for local troubleshooting)
  rejectUnauthorized: process.env.SKIP_R2_SSL_VERIFY === "true" ? false : true,
});

const client = new S3Client({
  endpoint,
  region: process.env.R2_REGION || "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  requestHandler: new NodeHttpHandler({ httpsAgent }),
});

export default {
  putObject: async (params) => {
    const cmd = new PutObjectCommand(params);
    return client.send(cmd);
  },
  deleteObject: async (key) => {
    const cmd = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    return client.send(cmd);
  },
  client,
};