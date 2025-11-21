import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";
const client = new MongoClient(uri);
const dbName = "offgridleaderboard";

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("crews");

    const crews = await collection.find({}).toArray();
    return NextResponse.json(crews);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch crews" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Crew name is required" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("crews");

    const result = await collection.insertOne({ name });
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to add crew" }, { status: 500 });
  } finally {
    await client.close();
  }
}
