const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { GridFSBucket } = require('mongodb');

const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    line = line.trim();
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

function downloadImageToBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function uploadToGridFS(bucket, buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
    });
    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.end(buffer);
  });
}

async function processDocument(doc, bucket) {
  let changed = false;

  async function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && val.includes('cloudinary.com')) {
        try {
          console.log(`Downloading ${val}...`);
          const buffer = await downloadImageToBuffer(val);
          const ext = path.extname(new URL(val).pathname) || '.jpg';
          const filename = `migrated_${Date.now()}${ext}`;
          const fileId = await uploadToGridFS(bucket, buffer, filename);
          obj[key] = `/api/images/${fileId}`;
          changed = true;
          console.log(`Migrated to ${obj[key]}`);
        } catch (err) {
          console.error(`Failed to migrate ${val}:`, err.message);
        }
      } else if (typeof val === 'object') {
        await traverse(val);
      }
    }
  }

  await traverse(doc);
  return changed;
}

async function migrate() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const bucket = new GridFSBucket(db, { bucketName: 'images' });

  const collections = await db.listCollections().toArray();

  for (const collInfo of collections) {
    // skip system collections or gridfs collections
    if (collInfo.name.startsWith('system.') || collInfo.name === 'images.files' || collInfo.name === 'images.chunks') continue;
    
    const collection = db.collection(collInfo.name);
    const docs = await collection.find({}).toArray();

    for (const doc of docs) {
      const changed = await processDocument(doc, bucket);
      if (changed) {
        await collection.updateOne({ _id: doc._id }, { $set: doc });
        console.log(`Updated document in ${collInfo.name}`);
      }
    }
  }

  console.log('Finished migrating remaining Cloudinary images.');
  await mongoose.disconnect();
}

migrate().catch(console.error);
