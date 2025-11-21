import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://rjugbhery:offgrid2025pswd@timeattack.z7tzwnm.mongodb.net";
const client = new MongoClient(uri);
const dbName = "timeattack";

export async function GET() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gta_blips");

    const blips = await collection.find({}).toArray();
    return NextResponse.json(blips);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch blips" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, timeUTC, eventName, carClass, trackName, coords } = body;

    if (!date || !timeUTC || !eventName || !carClass || !coords) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gta_blips");

    const result = await collection.insertOne({ date, timeUTC, eventName, carClass, trackName, coords });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to add blip" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gta_blips");

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: body });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Failed to update blip" }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("gta_blips");

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete blip" }, { status: 500 });
  } finally {
    await client.close();
  }
}
