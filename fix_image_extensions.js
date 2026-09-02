const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

let env = fs.readFileSync('.env.local', 'utf8');
let uri = env.split('\n').find(l => l.startsWith('MONGODB_URI=')).replace('MONGODB_URI=', '').trim().replace('\r', '');

const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db();
  const collections = await db.listCollections().toArray();
  
  for (const collInfo of collections) {
    if (collInfo.name.startsWith('system.')) continue;
    const collection = db.collection(collInfo.name);
    const docs = await collection.find({}).toArray();
    let updated = 0;
    
    for (const doc of docs) {
      let changed = false;
      function traverse(obj) {
        if (!obj || typeof obj !== 'object') return;
        for (const key of Object.keys(obj)) {
          if (typeof obj[key] === 'string' && obj[key].endsWith('.png')) {
             const knownJpgs = [
               'mother-child', 
               'product-dummy', 
               'pineapple-transition', 
               'review-placeholder', 
               'real-people', 
               'sustento-pouch-pineapple', 
               'sustento-pouch-strawberry', 
               'sustento-pouch-mango', 
               'sustento-pouch-banana', 
               'sustento-pouch-lemon', 
               'sustento-pouch-chocolate-strawberry'
             ];
             
             for (const base of knownJpgs) {
                if (obj[key].includes(base + '.png')) {
                   obj[key] = obj[key].replace(base + '.png', base + '.jpg');
                   changed = true;
                }
             }
          } else if (typeof obj[key] === 'object') {
             traverse(obj[key]);
          }
        }
      }
      traverse(doc);
      if (changed) {
        await collection.updateOne({ _id: doc._id }, { $set: doc });
        updated++;
      }
    }
    if (updated > 0) console.log(`Updated ${updated} docs in ${collInfo.name}`);
  }
  console.log('Done');
  client.close();
}
run();
