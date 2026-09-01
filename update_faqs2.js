const { MongoClient } = require('mongodb');
const uri = 'mongodb://codevibe2003_db_user:x4PmZjZdGbvnTRVU@ac-8l3lfif-shard-00-00.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-01.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-02.ibryjgn.mongodb.net:27017/susteno?ssl=true&replicaSet=atlas-mpixl2-shard-0&authSource=admin&appName=Cluster0';
async function run() {
  const c = new MongoClient(uri);
  await c.connect();
  const res = await c.db('susteno').collection('faqs').updateOne(
    { question: 'Who founded Sustento Nutrition?' },
    { $set: { question: 'Who founded Sustento?' } }
  );
  console.log('Updated:', res.modifiedCount);
  await c.close();
}
run();
