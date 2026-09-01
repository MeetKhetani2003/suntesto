const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { GridFSBucket, ObjectId } = require('mongodb');

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

async function uploadToGridFS(bucket, filePath, filename) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: filePath.endsWith('.png') ? 'image/png' : 'image/jpeg'
    });
    
    stream.pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id));
  });
}

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
  }

  console.log('Connecting to NEW MongoDB...', uri);
  await mongoose.connect(uri);
  console.log('Connected.');

  const db = mongoose.connection.db;
  const bucket = new GridFSBucket(db, { bucketName: 'images' });

  // Read all json files in backup dir
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const collName = file.replace('.json', '');
    const jsonPath = path.join(BACKUP_DIR, file);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    if (data.length === 0) {
      console.log(`Skipping empty collection: ${collName}`);
      continue;
    }

    console.log(`Migrating collection: ${collName} (${data.length} documents)`);
    const collection = db.collection(collName);

    for (let doc of data) {
      // Fix _id if it's string, convert back to ObjectId so MongoDB treats it as ID
      if (typeof doc._id === 'string' && ObjectId.isValid(doc._id)) {
        doc._id = new ObjectId(doc._id);
      }

      // If it's a product, upload images to GridFS and replace URLs
      if (collName === 'products') {
        const slug = doc.slug || doc._id.toString();
        const productImgDir = path.join(IMAGES_DIR, slug);
        
        if (fs.existsSync(productImgDir)) {
          // Replace images array
          if (Array.isArray(doc.images)) {
            const newImages = [];
            for (let i = 0; i < doc.images.length; i++) {
              const ext = path.extname(new URL(doc.images[i]).pathname) || '.jpg';
              const imgPath = path.join(productImgDir, `image_${i}${ext}`);
              
              if (fs.existsSync(imgPath)) {
                const fileId = await uploadToGridFS(bucket, imgPath, `image_${i}${ext}`);
                newImages.push(`/api/images/${fileId}`);
                console.log(`Uploaded ${slug}/image_${i}${ext} to GridFS`);
              } else {
                newImages.push(doc.images[i]); // Fallback
              }
            }
            doc.images = newImages;
          }

          // Replace ingredients image
          if (doc.ingredientsImage) {
            const ext = path.extname(new URL(doc.ingredientsImage).pathname) || '.jpg';
            const imgPath = path.join(productImgDir, `ingredients${ext}`);
            if (fs.existsSync(imgPath)) {
              const fileId = await uploadToGridFS(bucket, imgPath, `ingredients${ext}`);
              doc.ingredientsImage = `/api/images/${fileId}`;
              console.log(`Uploaded ${slug}/ingredients${ext} to GridFS`);
            }
          }
        }
      }

      // Insert document
      try {
        await collection.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
      } catch (err) {
        console.error(`Error inserting into ${collName}:`, err.message);
      }
    }
  }

  console.log('Migration completed successfully.');
  await mongoose.disconnect();
}

migrate().catch(console.error);
