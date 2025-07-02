import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if(!MONGODB_URI) throw new Error('MONGODB_URI is missing');
  
  console.log('Connecting to MongoDB...');
  console.log('MongoDB URI (first 10 chars):', MONGODB_URI.substring(0, 10) + '...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Full MongoDB URI:', MONGODB_URI); // Temporary - remove after debugging
  
  try {
    // We're explicitly setting the dbName here, even though it might be in the URI
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })

    cached.conn = await cached.promise;
    console.log('MongoDB connection successful, state:', mongoose.connection.readyState);
    console.log('Connected to database:', mongoose.connection.name);
    console.log('Full connection details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    });
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}