"use client";

import { useState } from "react";
import GalaxyScene from "./GalaxyScene";
import ExportButton from "./ExportButton";
import UserProfileCard from "./UserProfileCard";
import AboutModal from "./AboutModal";
import LegendModal from "./LegendModal";

export default function Home() {
    const [activeUsername, setActiveUsername] = useState("torvalds");
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim() !== "") {
            setActiveUsername(searchInput.trim());
            setSearchInput("");
        }
    };

    return (
        <main className="relative h-screen w-screen bg-black overflow-hidden font-sans">

            {/* THE 3D CANVAS (Background Layer) */}
            <div className="absolute inset-0 z-0">
                <GalaxyScene key={activeUsername} username={activeUsername} />
            </div>

            {/* THE UI OVERLAY (Foreground Layer) */}
            <div className="absolute top-0 left-0 w-full z-10 pointer-events-none p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-3">

                {/* Logo / Branding Area */}
                <div className="pointer-events-auto backdrop-blur-md bg-black/40 border border-white/10 p-3 sm:p-4 rounded-2xl shadow-[0_0_20px_rgba(255,136,0,0.15)]">
                    <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 tracking-widest uppercase">
                        Git-Galaxy
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Cosmic Engine Explorer v2.0</p>
                </div>

                {/* Search + Export */}
                <div className="flex items-center gap-3 pointer-events-auto flex-wrap sm:flex-nowrap">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center space-x-3 backdrop-blur-md bg-black/40 border border-white/20 p-2 rounded-full shadow-lg transition-all focus-within:border-orange-500/50 focus-within:shadow-[0_0_30px_rgba(255,136,0,0.2)]"
                    >
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search GitHub User..."
                            className="bg-transparent border-none outline-none text-white px-3 sm:px-4 py-2 w-48 sm:w-64 placeholder-gray-500 font-mono text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 sm:px-6 py-2 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(255,136,0,0.4)] hover:shadow-[0_0_25px_rgba(255,136,0,0.6)] text-sm"
                        >
                            Launch
                        </button>
                    </form>
                    <ExportButton />
                </div>
            </div>

            {/* User Profile Card */}
            <UserProfileCard username={activeUsername} />

            {/* Bottom Floating Buttons */}
            <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-3 pointer-events-none">
                <LegendModal />
                <AboutModal />
            </div>
        </main>
    );
}