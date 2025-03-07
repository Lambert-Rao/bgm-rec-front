// api/server.js
import express from 'express';
import mongoose from 'mongoose';

console.log('Starting server script...');

const app = express();
const dbUrl = process.env.MONGODB_URL; // Get the database URL from environment variables
const db = mongoose.createConnection(dbUrl);

db.on('error', (error) => {
  console.error('Connection error:', error);
  process.exit(1); // Exit the process with an error code
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/anime/sim/:id', async (req, res) => {
  const { id } = req.params;
  // console.log(`Received request for anime_id: ${id}`);

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;