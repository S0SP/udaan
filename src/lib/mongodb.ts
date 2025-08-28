import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (!DB_NAME) {
    throw new Error('Please define the DB_NAME environment variable');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  
  const db = client.db(DB_NAME);
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

// Database collections
export const COLLECTIONS = {
  INVOICES: 'invoices',
  BARCODES: 'barcodes',
  PRODUCTS: 'products'
} as const;
