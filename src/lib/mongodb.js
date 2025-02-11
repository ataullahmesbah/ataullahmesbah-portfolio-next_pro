import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Please add your MongoDB URI to .env.local");
}

const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect().then((c) => {
            console.log("✅ MongoDB Connected (Development)");
            return c;
        });
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().then((c) => {
        console.log("✅ MongoDB Connected (Production)");
        return c;
    });
}

export default clientPromise;
