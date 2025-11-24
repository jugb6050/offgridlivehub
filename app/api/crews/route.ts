import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";
const client = new MongoClient(uri);
const dbName = "offgridleaderboard";

// GET Crews
export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("crews");

    const crews = await collection.find({}).toArray();
    return NextResponse.json(crews);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch crews" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST New Crew
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Crew name is required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("crews");

    const result = await collection.insertOne({ name });
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to add crew" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE Crew
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Crew name is required for deletion" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("crews");

    const result = await collection.deleteOne({ name });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Crew not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Failed to delete crew" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
