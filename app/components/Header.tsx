"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="relative z-50 w-full bg-black border-b-4 border-e-yellow-200">
      <div className="py-6 px-8 text-center bg-gradient-to-r from-yellow-300 via-black to-yellow-300 animate-background-glow">
        <Link
          href="/"
          className="text-white text-5xl md:text-6xl font-cyberpunk tracking-widest hover:text-white transition-all duration-300"
        >
          OFF GRID x SMILERP
        </Link>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-200 via-white to-white animate-pulse" />
    </div>
  );
}
