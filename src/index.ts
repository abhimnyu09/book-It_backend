import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { connectDB, db } from './db'; // 1. Import 'db'

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
    
app.get('/', (req: Request, res: Response) => {
  res.send('Booklt Backend Server is running!');
});

// --- ADD THIS NEW ENDPOINT ---
app.get('/experiences', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).send('Database not connected');
    }
    
    // Find all documents in the 'experiences' collection
    const experiences = await db.collection('experiences').find({}).toArray();
    
    // Send the data as JSON
    res.json(experiences);

  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).send('Error fetching data');
  }
});
app.get('/experiences/:id', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).send('Database not connected');
    }

    // 1. Get the ID from the URL parameters
    const id = Number(req.params.id);

    // 2. Find the one document that matches the ID
    const experience = await db.collection('experiences').findOne({ id: id });

    // 3. Handle "Not Found"
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // 4. Send the single experience as JSON
    res.json(experience);

  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).send('Error fetching data');
  }
});
// In src/index.ts (add this below your GET /experiences/:id route)

app.get('/experiences/:id/availability', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).send('Database not connected');
    }

    const id = Number(req.params.id);

    // Find all bookings for this experience
    const bookings = await db.collection('bookings').find(
      { 'experience.id': id },
      // Only return the date and time fields
      { projection: { _id: 0, 'experience.date': 1, 'experience.time': 1 } }
    ).toArray();

    // bookings will look like:
    // [ { experience: { date: 'Oct 22', time: '09:00 am' } }, ... ]
    
    res.json(bookings);

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).send('Error fetching data');
  }
});
app.post('/bookings', async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(500).send('Database not connected');
    }

    const bookingData = req.body;
    const { experience } = bookingData;

    // --- UPDATED CHECK ---
    // We now check by experience.id, which is more reliable
    const existingBooking = await db.collection('bookings').findOne({
      'experience.id': experience.id, 
      'experience.date': experience.date,
      'experience.time': experience.time,
    });
    // ---------------------

    if (existingBooking) {
      return res.status(409).json({
        message: 'This slot is already booked. Please try another time.' 
      });
    }

    const result = await db.collection('bookings').insertOne(bookingData);

    res.status(201).json({ 
      message: 'Booking successful!',
      bookingId: result.insertedId 
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).send('Error creating booking');
  }
});
// --- ADD THIS NEW POST ENDPOINT ---
app.post('/promo/validate', async (req: Request, res: Response) => {
  try {
    const { promoCode } = req.body;

    // 1. Define our valid promo codes
    const validCodes: { [key: string]: number } = {
      'SAVE10': 10,     // 10% off
      'FLAT100': 100,  // ₹100 flat off
    };

    // 2. Check if the code exists
    if (validCodes[promoCode]) {
      res.json({
        valid: true,
        message: 'Promo code applied!',
        discountValue: validCodes[promoCode],
        type: promoCode === 'SAVE10' ? 'percentage' : 'flat'
      });
    } else {
      // 3. Send an invalid response
      res.status(404).json({
        valid: false,
        message: 'Invalid promo code'
      });
    }

  } catch (error) {
    res.status(500).send('Error validating promo code');
  }
});
// ---------------------------------

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
