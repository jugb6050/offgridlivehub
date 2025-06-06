"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-orbitron",
});

const utcStartTime = new Date("2025-06-01T22:00:00Z");

export default function RaceEventPage() {
  const [localTime, setLocalTime] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const local = utcStartTime.toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
    setLocalTime(local);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = utcStartTime.getTime() - now;

      if (distance <= 0) {
        setTimeRemaining("🚦 Race Started!");
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 sm:px-6 md:px-12 lg:px-24">
      <h1
        className={`${orbitron.variable} text-center text-3xl sm:text-4xl md:text-5xl mb-8 text-cyan-300 drop-shadow-[0_0_12px_#00ffff]`}
      >
        Off Grid Garbage Meetup
      </h1>

      <div className="w-full max-w-6xl mx-auto mb-10 rounded-xl border-4 border-cyan-500 shadow-[0_0_30px_#00ffff] overflow-hidden">
        <Image
          src="/garbage.png"
          alt="Race Event Map"
          width={1920}
          height={1080}
          priority
          sizes="(max-width: 768px) 100vw, 90vw"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2
          className={`${orbitron.variable} text-2xl sm:text-3xl md:text-4xl text-white`}
        >
          RACE DAY & START TIME
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl text-cyan-200">
          <span className="font-bold text-white">Original Time (UTC):</span>{" "}
          Sunday, June 8th, 2025 @ 8pm UTC
        </p>

        <p className="pt-2 text-lg sm:text-xl md:text-2xl text-pink-400">
          Setting Official Lap Times, to be added to live leaderboards.
        </p>
      </div>
    </div>
  );
}
