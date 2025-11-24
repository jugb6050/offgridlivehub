// app/api/brackets/route.ts
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";
const client = new MongoClient(uri);
const dbName = "offgridleaderboard";

async function getCollection() {
  if (!client.isConnected?.()) { // optional check for older versions, else just connect
    await client.connect();
  }
  return client.db(dbName).collection("brackets");
}

// GET all brackets
export async function GET() {
  try {
    await client.connect(); // connect if not already
    const collection = client.db(dbName).collection("brackets");
    const brackets = await collection.find({}).toArray();
    return NextResponse.json(brackets);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch brackets" }, { status: 500 });
  }
}

// POST a new bracket
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.size || !body.rounds) {
      return NextResponse.json({ error: "Invalid bracket data" }, { status: 400 });
    }

    await client.connect();
    const collection = client.db(dbName).collection("brackets");
    const result = await collection.insertOne(body);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to add bracket" }, { status: 500 });
  }
}

// PATCH/update bracket rounds
export async function PATCH(req: Request) {
  try {
    const { bracketId, rounds } = await req.json();
    if (!bracketId || !rounds) {
      return NextResponse.json({ error: "Invalid update data" }, { status: 400 });
    }

    await client.connect();
    const collection = client.db(dbName).collection("brackets");
    await collection.updateOne({ _id: new ObjectId(bracketId) }, { $set: { rounds } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Failed to update bracket" }, { status: 500 });
  }
}

// DELETE a bracket
export async function DELETE(req: Request) {
  try {
    const { bracketId } = await req.json();
    if (!bracketId) {
      return NextResponse.json({ error: "Invalid delete request" }, { status: 400 });
    }

    await client.connect();
    const collection = client.db(dbName).collection("brackets");
    await collection.deleteOne({ _id: new ObjectId(bracketId) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete bracket" }, { status: 500 });
  }
}
