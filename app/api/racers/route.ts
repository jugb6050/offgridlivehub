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
    const collection = db.collection("racers");

    // Fetch all racers
    const racers = await collection.find({}).toArray();

    return NextResponse.json(racers);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch racers" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rank, favoriteTrack, favoriteCar, raceTeam } = body;

    // Basic validation (same style as your other route)
    if (!name || !rank || !favoriteTrack || !favoriteCar || !raceTeam) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "Failed to add racer" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
