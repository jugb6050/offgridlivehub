"use client";

import Image from "next/image";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-orbitron",
});

export default function RaceEventPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 sm:px-6 md:px-12 lg:px-24">
      <h1
        className={`${orbitron.variable} text-center text-3xl sm:text-4xl md:text-5xl mb-8 text-yellow-200`}
      >
        Off Grid DMV Race Event
      </h1>

      <div className="w-full max-w-3xl mx-auto mb-10 rounded-xl border-4 border-yellow-200 overflow-hidden">
        <Image
          src="/dmvq.png"
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
          Event Start Time: October 24th, 2025 - Keep an eye out in RSX
        </h2>

        <p className="pt-2 text-lg sm:text-xl md:text-2xl text-pink-400">
          Underground DMV Race Event - Entry - 5k Per racer
        </p>
      </div>
    </div>
  );
}
