const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const path = require('path');
const fs = require('fs');
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

const MONGODB_URI = process.env.MONGODB_URI;
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'uploads', 'images');
const PUBLIC_VIDEOS_DIR = path.join(__dirname, 'public', 'uploads', 'videos');

if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_VIDEOS_DIR)) fs.mkdirSync(PUBLIC_VIDEOS_DIR, { recursive: true });

async function processDocument(doc, bucket) {
  let changed = false;
  async function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && val.startsWith('/api/images/')) {
        try {
          console.log(`Found GridFS URL: ${val}`);
          const fileId = val.split('/api/images/')[1];
          if (!fileId || fileId.length !== 24) continue;

          const objectId = new ObjectId(fileId);
          
          // Check if file exists in GridFS
          const files = await bucket.find({ _id: objectId }).toArray();
          if (files.length === 0) {
            console.log(`File ${fileId} not found in GridFS. Skipping download.`);
            continue;
          }
          
          const fileDoc = files[0];
          const isVideo = fileDoc.contentType && fileDoc.contentType.startsWith('video');
          const ext = isVideo ? '.mp4' : (fileDoc.filename.includes('.') ? path.extname(fileDoc.filename) : '.jpg');
          
          const folderName = isVideo ? "videos" : "images";
          const prefix = isVideo ? "video_" : "image_";
          const newFilename = `${prefix}recovered_${Date.now()}_${Math.floor(Math.random()*1000)}${ext}`;
          const filepath = path.join(isVideo ? PUBLIC_VIDEOS_DIR : PUBLIC_IMAGES_DIR, newFilename);
          
          // Download from GridFS to local
          const downloadStream = bucket.openDownloadStream(objectId);
          const writeStream = fs.createWriteStream(filepath);
          
          await new Promise((resolve, reject) => {
            downloadStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            downloadStream.on('error', reject);
          });
          
          obj[key] = `/uploads/${folderName}/${newFilename}`;
          changed = true;
          console.log(`Migrated GridFS file to local: ${obj[key]}`);
        } catch (err) {
          console.error(`Failed to migrate GridFS URL ${val}:`, err.message);
        }
      } else if (typeof val === 'object') {
        await traverse(val);
      }
    }
  }
  await traverse(doc);
  return changed;
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'images' });

    const collections = await db.listCollections().toArray();

    for (const collInfo of collections) {
      if (collInfo.name.startsWith('system.')) continue;
      
      const collection = db.collection(collInfo.name);
      const docs = await collection.find({}).toArray();

      let updateCount = 0;
      for (const doc of docs) {
        const changed = await processDocument(doc, bucket);
        if (changed) {
          await collection.updateOne({ _id: doc._id }, { $set: doc });
          updateCount++;
        }
      }
      if (updateCount > 0) {
        console.log(`Updated ${updateCount} documents in ${collInfo.name}`);
      }
    }
    console.log('GridFS to Local migration completed.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
