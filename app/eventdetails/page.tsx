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
        className={`${orbitron.variable} text-center text-3xl sm:text-4xl md:text-5xl mb-8 text-cyan-300 drop-shadow-[0_0_12px_#00ffff]`}
      >
        Off Grid x Empire Event
      </h1>

      <div className="w-full max-w-3xl mx-auto mb-10 rounded-xl border-4 border-cyan-500 shadow-[0_0_30px_#00ffff] overflow-hidden">
        <Image
          src="/flashgt.jpg"
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
          Event Start Time TBD:
        </h2>

        <p className="pt-2 text-lg sm:text-xl md:text-2xl text-pink-400">
          Fully Maxed Flash GT Raffle Pull
        </p>
      </div>
    </div>
  );
}
