import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
    throw new Error("Missing MONGODB_URI or MONGODB_DB in .env.local");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function connectDB() {
    try {
        await client.connect();
        // console.log("✅ Connected to MongoDB!");
        const db = client.db(dbName);
      
        return db;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw new Error("Database connection failed");
    }
}

