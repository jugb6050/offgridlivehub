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

    // Check if already seeded
    const count = await collection.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        message: "Racers already seeded. No action taken.",
      });
    }

    // Original 10 racers (all Off Grid)
    const racers = [
      {
        name: "Tommy Makinen",
        rank: "Odyssey - Leader",
        favoriteTrack: "DMV",
        favoriteCar: "Itali GTO",
        raceTeam: "Off Grid",
      },
      {
        name: "Ceri Makinen",
        rank: "Queen Odyssey - Second in Command",
        favoriteTrack: "Burgershot",
        favoriteCar: "Sunrise",
        raceTeam: "Off Grid",
      },
      {
        name: "Rowdy Makinen",
        rank: "Ghost- High Command",
        favoriteTrack: "Observatory",
        favoriteCar: "GB200",
        raceTeam: "Off Grid",
      },
      {
        name: "Tony Makinen",
        rank: "Ghost - High Command",
        favoriteTrack: "Observatory",
        favoriteCar: "Vigero",
        raceTeam: "Off Grid",
      },
      {
        name: "Oscar Makinen",
        rank: "Sentinel - Low Command",
        favoriteTrack: "DMV",
        favoriteCar: "Coquette D10",
        raceTeam: "Off Grid",
      },
      {
        name: "Ezra Ryoshi",
        rank: "Sentinel - Low Command",
        favoriteTrack: "Garbage",
        favoriteCar: "Argento",
        raceTeam: "Off Grid",
      },
      {
        name: "Jacob Jim Jim",
        rank: "Underglow - Recruit",
        favoriteTrack: "Garbage",
        favoriteCar: "Sunrise",
        raceTeam: "Off Grid",
      },
      {
        name: "Hector Newmen",
        rank: "Underglow - Recruit",
        favoriteTrack: "DMV",
        favoriteCar: "Sunrise",
        raceTeam: "Off Grid",
      },
      {
        name: "Mae Banner",
        rank: "Underglow - Recruit",
        favoriteTrack: "Observatory",
        favoriteCar: "Vigero",
        raceTeam: "Off Grid",
      },
      {
        name: "Danie Doyle",
        rank: "Social Media Manager",
        favoriteTrack: "Observatory",
        favoriteCar: "Vigero",
        raceTeam: "Off Grid",
      },
    ];

    await collection.insertMany(racers);

    return NextResponse.json({
      message: "Seed complete — 10 racers inserted.",
    });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json(
      { error: "Failed to seed racers" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
