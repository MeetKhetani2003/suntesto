const { MongoClient } = require('mongodb');

const NEW_URI = 'mongodb://codevibe2003_db_user:x4PmZjZdGbvnTRVU@ac-8l3lfif-shard-00-00.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-01.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-02.ibryjgn.mongodb.net:27017/susteno?ssl=true&replicaSet=atlas-mpixl2-shard-0&authSource=admin&appName=Cluster0';

const FILES_TO_FIX = [
  '/images/mother-child.png',
  '/images/product-dummy.png',
  '/images/pineapple-transition.png',
  '/images/review-placeholder.png',
  '/images/real-people.png'
];

async function processDocument(doc) {
  let changed = false;
  async function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string' && FILES_TO_FIX.includes(val)) {
        obj[key] = val.replace('.png', '.jpg');
        console.log(`Replaced ${val} with ${obj[key]}`);
        changed = true;
      } else if (typeof val === 'object') {
        await traverse(val);
      }
    }
  }
  await traverse(doc);
  return changed;
}

async function run() {
  const client = new MongoClient(NEW_URI);
  try {
    await client.connect();
    const db = client.db();
    
    const collections = await db.listCollections().toArray();
    for (const collInfo of collections) {
      if (collInfo.name.startsWith('system.')) continue;
      
      const collection = db.collection(collInfo.name);
      const docs = await collection.find({}).toArray();

      for (const doc of docs) {
        const changed = await processDocument(doc);
        if (changed) {
          await collection.updateOne({ _id: doc._id }, { $set: doc });
          console.log(`Updated document in ${collInfo.name}`);
        }
      }
    }
    console.log('Extensions patched successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}
run();
