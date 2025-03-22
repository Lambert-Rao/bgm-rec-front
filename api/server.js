// api/server.js
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const dbUrl = process.env.MONGODB_URL; // Get the database URL from environment variables
// const dbUrl = 'mongodb+srv:'; // Use a local database for now
const db = mongoose.createConnection(dbUrl);

db.on('error', (error) => {
  console.error('Connection error:', error);
  process.exit(1); // Exit the process with an error code
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/api/hello', (req, res) => {
  res.send('Hello World');
})

app.get('/api/anime/sim/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const collection = db.collection('sim');
    const data = await collection.findOne({ anime_id: parseInt(id) });

    if (data) {
      const ids = data.similar_animes.map((item) => item.valueOf());
      res.status(200).json(ids);
    } else {
      res.status(404).send('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/api/user/rec/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const collection = db.collection('user');
    const data = await collection.findOne({ user_id: parseInt(id) });

    if (data) {
      const ids = data.rec_animes.map((item) => item.valueOf());
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