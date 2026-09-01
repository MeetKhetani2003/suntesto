const { MongoClient } = require('mongodb');
const https = require('https');
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

// URI from .env.local
const MONGODB_URI = process.env.MONGODB_URI;

const PUBLIC_VIDEOS_DIR = path.join(__dirname, 'public', 'uploads', 'videos');
const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public', 'uploads', 'images');

if (!fs.existsSync(PUBLIC_VIDEOS_DIR)) fs.mkdirSync(PUBLIC_VIDEOS_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

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

async function processDocument(doc) {
  let changed = false;
  async function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && val.includes('res.cloudinary.com')) {
        try {
          console.log(`Downloading ${val}...`);
          const ext = path.extname(new URL(val).pathname) || (val.includes('/video/') ? '.mp4' : '.jpg');
          const isVideo = val.includes('/video/') || ext === '.mp4';
          
          const folderName = isVideo ? "videos" : "images";
          const prefix = isVideo ? "video_" : "image_";
          const filename = `${prefix}${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
          
          const filepath = path.join(isVideo ? PUBLIC_VIDEOS_DIR : PUBLIC_IMAGES_DIR, filename);
          
          await downloadMediaToFile(val, filepath);
          
          obj[key] = `/uploads/${folderName}/${filename}`;
          changed = true;
          console.log(`Migrated to local: ${obj[key]}`);
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

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('Connecting to Client DB for Local Migration...');
    await client.connect();
    const db = client.db();

    const collections = await db.listCollections().toArray();

    for (const collInfo of collections) {
      if (collInfo.name.startsWith('system.')) continue;
      
      const collection = db.collection(collInfo.name);
      const docs = await collection.find({}).toArray();

      if (docs.length === 0) continue;
      console.log(`Scanning ${collInfo.name} (${docs.length} documents)...`);

      let updateCount = 0;
      for (const doc of docs) {
        const changed = await processDocument(doc);
        if (changed) {
          await collection.updateOne({ _id: doc._id }, { $set: doc });
          updateCount++;
        }
      }
      if (updateCount > 0) {
        console.log(`Updated ${updateCount} documents in ${collInfo.name}`);
      }
    }
    console.log('Local Migration completed successfully.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.close();
  }
}

run();
