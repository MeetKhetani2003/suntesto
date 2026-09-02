const { MongoClient } = require('mongodb');
const fs = require('fs');

let env = fs.readFileSync('.env.local', 'utf8');
let uri = env.split('\n').find(l => l.startsWith('MONGODB_URI=')).replace('MONGODB_URI=', '').trim().replace('\r', '');

const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db();
  
  // kidsparents
  await db.collection('kidsparents').updateMany(
    { imageUrl: { $regex: /cloudinary/ } },
    { $set: { imageUrl: '/images/mother-child.jpg' } }
  );

  // testimonials
  await db.collection('testimonials').updateMany(
    { imageUrl: { $regex: /cloudinary/ } },
    { $set: { imageUrl: '/images/review-placeholder.jpg' } }
  );

  // realpeople
  await db.collection('realpeople').updateMany(
    { imageUrl: { $regex: /cloudinary/ } },
    { $set: { imageUrl: '/images/real-people.jpg' } }
  );

  console.log('Fixed Cloudinary URLs in database');
  client.close();
}
run();
