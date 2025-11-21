import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";
const client = new MongoClient(uri);
const dbName = "timeattack";

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("offgridleaderboard");

    // Fetch all entriåes
    const lapTimes = await collection.find({}).toArray();

    return NextResponse.json(lapTimes);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch lap times" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { racer, track, time, vehicle, approved } = body;

    if (!racer || !track || !time || !vehicle || !approved) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert time string to ms
    const timeParts = time.split(":").map(Number);
    if (
      timeParts.length !== 3 ||
      timeParts.some((n: number) => isNaN(n))
    ) {
      return NextResponse.json(
        { error: "Invalid time format" },
        { status: 400 }
      );
    }
    const [minutes, seconds, milliseconds] = timeParts;
    const timeInMs = minutes * 60000 + seconds * 1000 + milliseconds;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("offgridleaderboard");

    await collection.insertOne({
      racer,
      track,
      time,
      vehicle,
      approved,
      timeInMs,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to submit lap time" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
