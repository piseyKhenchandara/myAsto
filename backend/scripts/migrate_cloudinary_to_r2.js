import cloudinary from "../config/cloudinary.js";
import r2 from "../config/r2.js";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import db from "../models/index.js";

const OUT_DIR = path.resolve(process.cwd(), "scripts", "migration_output");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function makePublicUrl(key) {
  const base = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (!base) return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;
  return `${base}/${key}`;
}

async function uploadBufferToR2(buffer, key, contentType) {
  try {
    await r2.putObject({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
   
    });
    return makePublicUrl(key);
  } catch (err) {
    console.error("R2 upload error for key=", key, err);
    throw err;
  }
}

async function migrateImages() {
  let next_cursor = undefined;
  const mapping = [];
  do {
    const res = await cloudinary.api.resources({ resource_type: "image", max_results: 500, next_cursor });
    for (const r of res.resources) {
      try {
        const url = r.secure_url || r.url;
        if (!url) {
          console.warn("no url for", r.public_id);
          mapping.push({ old_public_id: r.public_id, error: "no url" });
          continue;
        }
        const resp = await fetch(url);
        if (!resp.ok) {
          console.error("fetch failed", r.public_id, resp.status, resp.statusText);
          mapping.push({ old_public_id: r.public_id, error: `fetch ${resp.status}` });
          continue;
        }
        const arrayBuffer = await resp.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const ext = r.format || "jpg";
        const key = `cloudinary_migrated/images/${r.public_id}.${ext}`;
        const publicUrl = await uploadBufferToR2(buffer, key, resp.headers.get("content-type"));

        // Update DB: adjust models/fields if needed
        const where = { public_id: r.public_id };
        if (db.ProductImage) await db.ProductImage.update({ image_url: publicUrl, public_id: key }, { where });
        if (db.ProductBanner) await db.ProductBanner.update({ image_url: publicUrl, public_id: key }, { where });
        if (db.Brand) await db.Brand.update({ logo_url: publicUrl, public_id: key }, { where });
        if (db.Category) await db.Category.update({ image_url: publicUrl, public_id: key }, { where });
        if (db.User) await db.User.update({ profile_picture: publicUrl, public_id: key }, { where });

        mapping.push({ old_public_id: r.public_id, new_key: key, url: publicUrl });
        console.log("migrated", r.public_id, "->", key);
      } catch (err) {
        console.error("failed", r.public_id, err);
        mapping.push({ old_public_id: r.public_id, error: String(err) });
      }
    }
    next_cursor = res.next_cursor;
  } while (next_cursor);

  fs.writeFileSync(path.join(OUT_DIR, "mapping_images.json"), JSON.stringify(mapping, null, 2));
  console.log("done. mapping saved to", path.join(OUT_DIR, "mapping_images.json"));
}

(async () => {
  try {
    if (!process.env.R2_BUCKET_NAME || !process.env.R2_ENDPOINT && !process.env.R2_ACCOUNT_ID) {
      console.error("Set R2_BUCKET_NAME and R2_ENDPOINT or R2_ACCOUNT_ID in backend/.env before running.");
      process.exit(1);
    }
    console.log("Using R2 endpoint:", process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
    await migrateImages();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();