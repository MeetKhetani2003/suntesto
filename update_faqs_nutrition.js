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
    let changed = false;
    if (doc.question && doc.question.includes('Sustento Nutrition')) {
      doc.question = doc.question.replace('Sustento Nutrition', 'Sustento');
      changed = true;
    }
    if (doc.answer && doc.answer.includes('Sustento Nutrition')) {
      doc.answer = doc.answer.replace('Sustento Nutrition', 'Sustento');
      changed = true;
    }
    if (changed) {
      await collection.updateOne({ _id: doc._id }, { $set: { question: doc.question, answer: doc.answer } });
      updated++;
    }
  }

  console.log(`Updated ${updated} FAQs to remove "Nutrition".`);
  client.close();
}
run();
