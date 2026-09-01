const { MongoClient } = require('mongodb');

const uri = "mongodb://codevibe2003_db_user:x4PmZjZdGbvnTRVU@ac-8l3lfif-shard-00-00.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-01.ibryjgn.mongodb.net:27017,ac-8l3lfif-shard-00-02.ibryjgn.mongodb.net:27017/susteno?ssl=true&replicaSet=atlas-mpixl2-shard-0&authSource=admin&appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('susteno');
    const faqs = db.collection('faqs');
    
    // Update question 1
    let q1 = await faqs.updateOne(
      { question: { $regex: /What is Sustento/i } },
      { 
        $set: { 
          question: "What is Sustento all about?",
          answer: "Sustento is a clean-label food brand dedicated to making real food smarter. We offer whole fruit snacks made purely from natural, minimally processed ingredients with absolutely zero chemical additives, preservatives, or added sugars."
        } 
      }
    );
    console.log("Updated Q1:", q1.modifiedCount);

    // Update question 2
    let q2 = await faqs.updateOne(
      { question: { $regex: /Who founded Sustento/i } },
      { 
        $set: { 
          answer: "Sustento was founded by a passionate team of food innovators, including Raj Kotadiya and Rushit Kotadiya, who wanted to solve the compromise between eating healthy and enjoying delicious food."
        } 
      }
    );
    console.log("Updated Q2:", q2.modifiedCount);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
