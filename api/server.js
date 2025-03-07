// api/server.js
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const dbUrl = process.env.MONGODB_URL; // Get the database URL from environment variables
// const dbUrl = 'mongodb://arch.me:27017/bangumi'; // Use a local database for now
const db = mongoose.createConnection(dbUrl);

db.on('error', (error) => {
  console.error('Connection error:', error);
  process.exit(1); // Exit the process with an error code
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/api/anime/sim/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const collection = db.collection('sim');
    const data = await collection.findOne({ anime_id: parseInt(id) });

    if (data) {
      const ids = data.similarities.map((item) => item.similar_anime_id);
      res.status(200).json(ids);
    } else {
      res.status(404).send('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

export default app;