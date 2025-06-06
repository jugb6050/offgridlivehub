import { MongoClient, Db } from "mongodb";

const uri =
  "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net/?retryWrites=true&w=majority&appName=timeattack";

const client = new MongoClient(uri);
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;
  await client.connect();
  cachedDb = client.db("offgridleaderboard");
  return cachedDb;
}
