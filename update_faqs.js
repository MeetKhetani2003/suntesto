const { MongoClient } = require('mongodb');
const fs = require('fs');

let env = fs.readFileSync('.env.local', 'utf8');
let uri = env.split('\n').find(l => l.startsWith('MONGODB_URI=')).replace('MONGODB_URI=', '').trim().replace('\r', '');

const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db();
  const collection = db.collection('faqs');

  const docs = await collection.find({}).toArray();
  let updated = 0;
  for (const doc of docs) {
    if (doc.answer && doc.answer.includes('Sustento was founded by a passionate team of food innovators')) {
      doc.answer = 'Sustento was founded by a passionate team of food innovators, including Raj Kotadiya and Rushit Kotadiya, who wanted to solve the compromise between eating healthy and enjoying delicious food.';
      await collection.updateOne({ _id: doc._id }, { $set: { answer: doc.answer } });
      updated++;
    }
  }

  console.log(`Updated ${updated} FAQs.`);
  client.close();
}
run();
