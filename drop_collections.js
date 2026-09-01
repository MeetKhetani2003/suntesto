const { MongoClient } = require('mongodb');

const NEW_URI = 'mongodb://codevibe2003_db_user:x4PmZjZdGbvnTRVU@ac-8l3lfif-shard-00-00.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-01.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-02.ibryjgn.mongodb.net:27017/susteno?ssl=true&replicaSet=atlas-mpixl2-shard-0&authSource=admin&appName=Cluster0';

async function run() {
  const client = new MongoClient(NEW_URI);
  try {
    await client.connect();
    const db = client.db();
    
    console.log('Dropping images.files...');
    await db.collection('images.files').drop().catch(() => console.log('images.files not found'));
    
    console.log('Dropping images.chunks...');
    await db.collection('images.chunks').drop().catch(() => console.log('images.chunks not found'));
    
    console.log('GridFS collections dropped successfully. Space should be freed.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}
run();
