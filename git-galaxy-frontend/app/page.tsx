"use client";

import { useState, useEffect } from "react";
import GalaxyScene from "./GalaxyScene";

const DEFAULT_PROFILES = ["torvalds", "shanselman", "obra", "yyx990803", "bradtraversy", "tj"];
import ExportButton from "./ExportButton";
import UserProfileCard from "./UserProfileCard";
import AboutModal from "./AboutModal";
import LegendModal from "./LegendModal";

export default function Home() {
    const [activeUsername, setActiveUsername] = useState("");
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * DEFAULT_PROFILES.length);
        setActiveUsername(DEFAULT_PROFILES[randomIndex]);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim() !== "") {
            setActiveUsername(searchInput.trim());
            setSearchInput("");
        }
    };

    if (!activeUsername) {
        return <main className="relative h-screen w-screen bg-black overflow-hidden" />;
    }

    return (
        <main className="relative h-screen w-screen bg-black overflow-hidden font-sans">

            {/* THE 3D CANVAS (Background Layer) */}
            <div className="absolute inset-0">
                <GalaxyScene key={activeUsername} username={activeUsername} />
            </div>

            {/* THE UI OVERLAY (Foreground Layer) */}
            <div className="absolute top-0 left-0 w-full z-10 pointer-events-none p-1.5 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-3">

                {/* Logo / Branding Area */}
                <div className="pointer-events-auto backdrop-blur-md bg-black/40 border border-white/10 p-1.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-[0_0_20px_rgba(255,136,0,0.15)] w-full sm:w-auto flex justify-between items-center sm:block">
                    <div>
                        <h1 className="text-base sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 tracking-widest uppercase">
                            Git-Galaxy
                        </h1>
                        <p className="hidden sm:block text-gray-400 text-sm mt-1">Cosmic Engine Explorer v2.0</p>
                    </div>
                    {/* Mobile Export Button */}
                    <div className="sm:hidden pointer-events-auto">
                        <ExportButton username={activeUsername} />
                    </div>
                </div>

                {/* Search + Export */}
                <div className="flex items-center gap-3 pointer-events-auto w-full sm:w-auto">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center space-x-1 sm:space-x-3 backdrop-blur-md bg-black/40 border border-white/20 p-0.5 sm:p-2 rounded-full shadow-lg transition-all focus-within:border-orange-500/50 focus-within:shadow-[0_0_30px_rgba(255,136,0,0.2)] w-full sm:w-auto"
                    >
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search GitHub User..."
                            className="bg-transparent border-none outline-none text-white px-2 sm:px-4 py-1.5 sm:py-2 flex-grow sm:w-64 placeholder-gray-500 font-mono text-xs sm:text-sm min-w-0"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-2.5 sm:px-6 py-1 sm:py-2 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(255,136,0,0.4)] hover:shadow-[0_0_25px_rgba(255,136,0,0.6)] text-[10px] sm:text-sm whitespace-nowrap"
                        >
                            Launch
                        </button>
                    </form>
                    {/* Desktop Export Button */}
                    <div className="hidden sm:block pointer-events-auto">
                        <ExportButton username={activeUsername} />
                    </div>
                </div>
            </div>

            {/* User Profile Card */}
            <UserProfileCard username={activeUsername} />

            {/* Bottom Floating Buttons */}
            <div className="absolute bottom-2 sm:bottom-6 left-0 right-0 z-10 flex items-center justify-center gap-1.5 sm:gap-3 pointer-events-none">
                <LegendModal />
                <AboutModal />
            </div>
        </main>
    );
}