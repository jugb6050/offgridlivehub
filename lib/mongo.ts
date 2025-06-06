import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net/?retryWrites=true&w=majority&appName=timeattack";

const client = new MongoClient(uri);
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  await client.connect();
  cachedDb = client.db("offgridleaderboard");
  return cachedDb;
}
