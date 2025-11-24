"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Race Team", href: "/racers" },
  { name: "Time Attack Leaderboards", href: "/leaderboard" },
  { name: "Interactive Map", href: "/map" },
  { name: "Head 2 Head", href: "/head2head" },
  { name: "Race Event Details", href: "/eventdetails" },
  { name: "Race Bracket Tool", href: "/racebracket" }, // NEW PAGE
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black text-white border-b-2 border-white px-4 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {/* Left: Nav Items */}
        <ul className="flex flex-wrap gap-4 sm:gap-6 justify-center items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative px-3 py-2 text-sm sm:text-lg font-semibold transition duration-300 
                    ${isActive ? "text-yellow-200" : "hover:text-yellow-300"}
                    after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-yellow-300 after:transition-all after:duration-300
                    hover:after:w-full hover:after:left-0
                  `}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Gap between nav items and external buttons */}
        <div className="w-full sm:w-auto h-2"></div>

        {/* Right: External Buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <a
            href="https://www.razed.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-black font-semibold bg-white rounded border border-gray-300 hover:bg-blue-200 transition duration-300 text-sm sm:text-base"
          >
            Razed Casino
          </a>
          <a
            href="https://discord.gg/T3sAKntS"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-black font-semibold bg-white rounded border border-gray-300 hover:bg-indigo-200 transition duration-300 text-sm sm:text-base"
          >
            SMILERP Discord
          </a>
          <a
            href="https://discord.gg/CYb86KHBBj"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-black font-semibold bg-white rounded border border-gray-300 hover:bg-purple-200 transition duration-300 text-sm sm:text-base"
          >
            OFG Discord
          </a>
        </div>
      </div>
    </nav>
  );
}
