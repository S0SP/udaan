import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://sumitchourasia63:lvPmW0TvP5XxqAos@cluster0.o4znxej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'kiraanakloud';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
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
