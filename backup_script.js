const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');

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

const BACKUP_DIR = path.join(__dirname, 'sustento_backup');
const IMAGES_DIR = path.join(BACKUP_DIR, 'images');

// Create backup directories
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Helper to download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return resolve();
    }
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      console.error(`Failed to download ${url}:`, err.message);
      resolve(); // resolve anyway to continue backup
    });
  });
};

async function backup() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();

  for (let collInfo of collections) {
    const collName = collInfo.name;
    console.log(`Backing up collection: ${collName}`);
    
    const collection = db.collection(collName);
    const documents = await collection.find({}).toArray();
    
    const jsonPath = path.join(BACKUP_DIR, `${collName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(documents, null, 2));

    // If this is the products collection, download images
    if (collName === 'products') {
      console.log('Downloading product images...');
      for (const product of documents) {
        const slug = product.slug || product._id.toString();
        const productImgDir = path.join(IMAGES_DIR, slug);
        if (!fs.existsSync(productImgDir)) {
          fs.mkdirSync(productImgDir, { recursive: true });
        }

        // Download main images
        if (Array.isArray(product.images)) {
          for (let i = 0; i < product.images.length; i++) {
            const url = product.images[i];
            const ext = path.extname(new URL(url).pathname) || '.jpg';
            const imgPath = path.join(productImgDir, `image_${i}${ext}`);
            await downloadImage(url, imgPath);
          }
        }

        // Download ingredients image
        if (product.ingredientsImage) {
          const url = product.ingredientsImage;
          const ext = path.extname(new URL(url).pathname) || '.jpg';
          const imgPath = path.join(productImgDir, `ingredients${ext}`);
          await downloadImage(url, imgPath);
        }
      }
      console.log('Finished downloading product images.');
    }
  }

  console.log('Closing connection...');
  await mongoose.disconnect();
  console.log('Backup completed successfully to:', BACKUP_DIR);
}

backup().catch(console.error);
