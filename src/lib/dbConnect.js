import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

console.log("🔹 MONGODB_URI:", uri ? "✅ Found" : "❌ Not Found");

if (!uri) {
    throw new Error("⚠️ MONGODB_URI is missing in .env.local");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function dbConnect(collectionName) {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");
        return client.db(dbName).collection(collectionName);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        throw error;
    }
}
