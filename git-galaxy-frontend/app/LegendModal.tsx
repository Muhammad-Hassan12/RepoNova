"use client";

import { useState } from "react";

const LEGEND_ITEMS = [
    { icon: "🌟", title: "Star", desc: "A GitHub Repository. The larger the star, the more GitHub stars the repo has." },
    { icon: "🎨", title: "Star Color", desc: "Corresponds to the primary programming language of the repository." },
    { icon: "☄️", title: "Orbiting Particles", desc: "The number of commits. More particles = more commits in the past year." },
    { icon: "🌌", title: "Black Hole", desc: "The GitHub User. Click it to reset your view." },
    { icon: "🌫️", title: "Nebula", desc: "A visual representation of the user's contribution heatmap over the last year." },
    { icon: "🚀", title: "Gravitational Lanes", desc: "Visual connections representing open Pull Requests between repositories." },
];

export default function LegendModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="pointer-events-auto backdrop-blur-md bg-black/30 border border-orange-500/30 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-orange-400 hover:text-orange-300 text-[10px] sm:text-xs font-mono transition-all hover:bg-orange-500/10 hover:border-orange-500/50 font-bold shadow-[0_0_15px_rgba(255,136,0,0.2)]"
            >
                🗺️ Map Legend
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl max-w-sm w-full mx-4 shadow-[0_0_60px_rgba(255,136,0,0.15)] overflow-y-auto max-h-[90vh] animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white tracking-widest uppercase">
                                Cosmic Legend
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
                        </div>

                        <div className="p-6 space-y-3">
                            {LEGEND_ITEMS.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors">
                                    <span className="text-2xl mt-0.5" style={{ textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>{item.icon}</span>
                                    <div>
                                        <h3 className="text-white font-bold text-sm tracking-wide">{item.title}</h3>
                                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white/10 hover:bg-white/15 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
