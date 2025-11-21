import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";
const client = new MongoClient(uri);
const dbName = "timeattack";

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("offgridleaderboard");

    const lapTimes = await collection.find({}).toArray();
    return NextResponse.json(lapTimes);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch lap times" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { racer, track, time, vehicle, approved } = body;

    if (!racer || !track || !time || !vehicle || !approved) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert time string to ms
    const [minutes, seconds, milliseconds] = time.split(":").map(Number);
    const timeInMs = minutes * 60000 + seconds * 1000 + milliseconds;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("offgridleaderboard");

    await collection.insertOne({ racer, track, time, vehicle, approved, timeInMs });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to submit lap time" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();

    // Only allow updating valid fields
    const allowedFields = ["racer", "track", "time", "vehicle", "approved"];
    const updateData: any = {};
    allowedFields.forEach(field => { if (field in body) updateData[field] = body[field]; });

    // If time is updated, recalc timeInMs
    if (updateData.time) {
      const [minutes, seconds, milliseconds] = updateData.time.split(":").map(Number);
      updateData.timeInMs = minutes * 60000 + seconds * 1000 + milliseconds;
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("offgridleaderboard");

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Failed to update lap time" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("offgridleaderboard");

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete lap time" }, { status: 500 });
  } finally {
    await client.close();
  }
}
