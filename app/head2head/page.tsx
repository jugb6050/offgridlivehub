"use client";

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-cyan-400 animate-pulse">
          🛠️ Coming Soon
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          The HEAD2HEAD SYSTEM WILL BE REVEALED VERY SOON
        </p>
        <p className="text-sm text-gray-500">Stay tuned for updates.</p>
      </div>
    </div>
  );
}
