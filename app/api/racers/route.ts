import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri =
  "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";

const client = new MongoClient(uri);
const dbName = "offgridleaderboard";

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("racers");

    const racers = await collection.find({}).toArray();
    return NextResponse.json(racers);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch racers" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rank, favoriteTrack, favoriteCar, raceTeam } = body;

    if (!name || !rank || !favoriteTrack || !favoriteCar || !raceTeam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("racers");

    const result = await collection.insertOne({
      name,
      rank,
      favoriteTrack,
      favoriteCar,
      raceTeam,
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to add racer" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();
    const { name, rank, favoriteTrack, favoriteCar, raceTeam } = body;

    if (!name || !rank || !favoriteTrack || !favoriteCar || !raceTeam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("racers");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, rank, favoriteTrack, favoriteCar, raceTeam } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No racer updated" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Failed to update racer" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("racers");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Racer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete racer" }, { status: 500 });
  } finally {
    await client.close();
  }
}
