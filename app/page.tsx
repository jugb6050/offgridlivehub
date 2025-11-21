"use client";

import { Orbitron } from "next/font/google";
import dynamic from "next/dynamic";
import Link from "next/link";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-orbitron",
});

// ✅ Load base react-player (not /youtube) to avoid type errors
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <ReactPlayer
        url="https://www.youtube.com/watch?v=EOqTHBTXixs"
        playing
        muted
        loop
        controls={false}
        width="100%"
        height="100%"
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              showinfo: 0,
              rel: 0,
              controls: 0,
              disablekb: 1,
              playsinline: 1,
            },
          },
        }}
        className="absolute top-0 left-0 object-cover pointer-events-none"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 text-center px-4">
        <h1
          className={`${orbitron.variable} text-3xl md:text-5xl lg:text-6xl font-bold tracking-widest animate-fadeInUp`}
        >
          DMV Underground Off Grid Lap Qualifying Event | Event Start Time: Dec
          5th, 2025 - Keep an eye out in RSX - One hour after Tsunami - 6pm EST
        </h1>
        <Link
          href="/eventdetails"
          className="mt-8 px-6 py-3 bg-yellow-300 hover:bg-yellow-300 text-black font-bold rounded-xl shadow-lg transition transform hover:scale-105"
        >
          View Event Details
        </Link>
      </div>
    </div>
  );
}
