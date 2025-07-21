import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

declare global {
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    }
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {
        conn: null, promise: null
    }
}

export const ConnectToDatabase = async () => {
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error('MONGODB_URL is not defined')

    cached.promise =
        cached.promise ||
        mongoose.connect(MONGODB_URL, {
            dbName: 'magnify', bufferCommands: false
        })

    cached.conn = await cached.promise;

    return cached.conn;
}
