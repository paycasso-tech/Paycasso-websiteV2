import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the type for our cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global namespace to include our mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cached variable with proper typing
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

// Set the global mongoose cache if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options: ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}