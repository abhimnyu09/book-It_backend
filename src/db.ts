import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import { experiences } from './data'; // Import our new data file

dotenv.config(); // Load variables from .env file

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in your .env file');
}

let db: Db;

// This function will add your local data to the database
const populateDB = async () => {
    if (!db) return;
  
    const experiencesCollection = db.collection('experiences');
    const count = await experiencesCollection.countDocuments();
  
    // If the collection is empty, insert the data
    if (count === 0) {
      try {
        await experiencesCollection.insertMany(experiences);
        console.log('[server]: Database populated with sample data.');
      } catch (error) {
        console.error('Error populating database:', error);
      }
      return; // We're done
    }
  
    // If the collection is NOT empty, let's just update the documents
    // to make sure they have the 'details' field.
    try {
      console.log('[server]: Checking for data updates...');
      for (const exp of experiences) {
        await experiencesCollection.updateOne(
          { id: exp.id }, // Find the document by its id
          { $set: { details: exp.details } } // Set the 'details' field
        );
      }
      console.log('[server]: Database data verified.');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

export const connectDB = async () => {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(); 
    
    console.log('[server]: Connected to MongoDB');

    // Add this line to populate the DB right after connecting
    await populateDB(); 

  } catch (error) {
    console.error('Could not connect to MongoDB', error);
    process.exit(1); // Exit the process with failure
  }
};

// Export the 'db' instance so we can use it in our routes
export { db };