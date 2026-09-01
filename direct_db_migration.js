const { MongoClient, GridFSBucket } = require('mongodb');
const https = require('https');
const path = require('path');
const fs = require('fs');

const OLD_URI = 'mongodb://sustento:sustento12345678@ac-prq0kbv-shard-00-00.iiuafry.mongodb.net:27017,ac-prq0kbv-shard-00-01.iiuafry.mongodb.net:27017,ac-prq0kbv-shard-00-02.iiuafry.mongodb.net:27017/sustento?ssl=true&replicaSet=atlas-9cf5ip-shard-0&authSource=admin&retryWrites=true&w=majority';
const NEW_URI = 'mongodb://codevibe2003_db_user:x4PmZjZdGbvnTRVU@ac-8l3lfif-shard-00-00.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-01.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-02.ibryjgn.mongodb.net:27017/susteno?ssl=true&replicaSet=atlas-mpixl2-shard-0&authSource=admin&appName=Cluster0';

const PUBLIC_VIDEOS_DIR = path.join(__dirname, 'public', 'uploads', 'videos');
if (!fs.existsSync(PUBLIC_VIDEOS_DIR)) {
  fs.mkdirSync(PUBLIC_VIDEOS_DIR, { recursive: true });
}

function downloadMediaToBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

function downloadMediaToFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
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
  async function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && val.includes('res.cloudinary.com')) {
        try {
          console.log(`Downloading ${val}...`);
          const ext = path.extname(new URL(val).pathname) || (val.includes('/video/') ? '.mp4' : '.jpg');
          
          if (val.includes('/video/') || ext === '.mp4') {
            // Video -> Public Folder
            const filename = `migrated_video_${Date.now()}${ext}`;
            const filepath = path.join(PUBLIC_VIDEOS_DIR, filename);
            await downloadMediaToFile(val, filepath);
            obj[key] = `/uploads/videos/${filename}`;
            console.log(`Migrated video to ${obj[key]}`);
          } else {
            // Image -> GridFS
            const buffer = await downloadMediaToBuffer(val);
            const filename = `migrated_image_${Date.now()}${ext}`;
            const fileId = await uploadToGridFS(bucket, buffer, filename);
            obj[key] = `/api/images/${fileId}`;
            console.log(`Migrated image to ${obj[key]}`);
          }
        } catch (err) {
          console.error(`Failed to migrate ${val}:`, err.message);
        }
      } else if (typeof val === 'object') {
        await traverse(val);
      }
    }
  }
  await traverse(doc);
}

async function run() {
  const oldClient = new MongoClient(OLD_URI);
  const newClient = new MongoClient(NEW_URI);

  try {
    console.log('Connecting to Old DB...');
    await oldClient.connect();
    const oldDb = oldClient.db();

    console.log('Connecting to New DB...');
    await newClient.connect();
    const newDb = newClient.db();
    const bucket = new GridFSBucket(newDb, { bucketName: 'images' });

    const collections = await oldDb.listCollections().toArray();

    for (const collInfo of collections) {
      if (collInfo.name.startsWith('system.')) continue;
      
      const oldColl = oldDb.collection(collInfo.name);
      const newColl = newDb.collection(collInfo.name);
      const docs = await oldColl.find({}).toArray();

      if (docs.length === 0) continue;
      console.log(`Migrating ${collInfo.name} (${docs.length} documents)...`);

      for (const doc of docs) {
        await processDocument(doc, bucket);
        await newColl.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
      }
    }
    console.log('Hybrid Migration completed successfully.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await oldClient.close();
    await newClient.close();
  }
}

run();
