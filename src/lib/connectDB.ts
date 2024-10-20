import { MongoClient, Db, ServerApiVersion } from "mongodb";

// Declare the types for db and client
let db: Db | undefined;
let client: MongoClient | undefined;

export const connectDB = async (): Promise<Db> => {
  if (db) return db;

  //org
  const uri: string =
    process.env.MONGODB_URI_ORG || "mongodb://localhost:27017/";

  // local compass
  // const uri = "mongodb://localhost:27017/";

  try {
    if (!client) {
      client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      await client.connect();
      console.log("Connected to MongoDB");
    }
    const dbName = process.env.MONGODB_ID;
    if (!dbName) {
      throw new Error("MONGODB_ID environment variable is not set");
    }
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};
