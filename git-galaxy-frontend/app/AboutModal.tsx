"use client";

import { useState } from "react";

const TECH_STACK = [
    { name: "Next.js", url: "https://nextjs.org", desc: "React Framework" },
    { name: "React Three Fiber", url: "https://r3f.docs.pmnd.rs", desc: "3D Rendering" },
    { name: "Three.js", url: "https://threejs.org", desc: "WebGL Engine" },
    { name: "Flask", url: "https://flask.palletsprojects.com", desc: "Python Backend" },
    { name: "GitHub GraphQL API", url: "https://docs.github.com/en/graphql", desc: "Data Source" },
];

const LIBRARIES = [
    "@react-three/drei",
    "@react-three/postprocessing",
    "flask-limiter",
    "flask-cors",
    "Geist Font by Vercel",
];

export default function AboutModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="pointer-events-auto backdrop-blur-md bg-black/30 border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-gray-500 hover:text-gray-300 text-[10px] sm:text-xs font-mono transition-all hover:bg-white/5 hover:border-white/20"
            >
                ℹ️ About GitGalaxy
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl max-w-lg w-full mx-4 shadow-[0_0_60px_rgba(255,136,0,0.15)] overflow-y-auto max-h-[90vh] animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 text-center">
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 tracking-widest uppercase">
                                Git-Galaxy
                            </h2>
                            <p className="text-gray-400 text-sm mt-1 font-mono">Cosmic Engine Explorer v2.0</p>
                            <p className="text-gray-500 text-xs mt-2 leading-relaxed max-w-sm mx-auto">
                                Transform any GitHub profile into a stunning 3D galaxy. Repos become stars, commits become asteroid belts, and pull requests become comets.
                            </p>
                        </div>

                        {/* Credits */}
                        <div className="p-6 space-y-5">
                            {/* Creator */}
                            <div>
                                <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">Created By</span>
                                <div className="mt-2 space-y-3">
                                    {/* Developer 1 */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors gap-3 sm:gap-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(255,136,0,0.4)]">
                                                A
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">AgenticEra Systems</p>
                                                <p className="text-orange-400 text-xs font-mono mt-0.5">Company</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href="https://www.linkedin.com/company/AgenticEra-Systems"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-[#0a66c2] transition-colors p-2 bg-black/40 rounded-lg border border-white/10 hover:border-white/30"
                                                title="LinkedIn"
                                            >
                                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Developer 2 */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors gap-3 sm:gap-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                                <img src="https://github.com/Muhammad-Hassan12.png" alt="S.M Hassan" className="w-10 h-10 rounded-full shadow-[0_0_15px_rgba(255,136,0,0.4)] border border-orange-500/50" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">Syed Muhammad Hassan</p>
                                                <p className="text-cyan-400 text-xs font-mono mt-0.5">AI Engineer & Co-Founder of AgenticEra Systems</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href="https://github.com/Muhammad-Hassan12"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-white transition-colors p-2 bg-black/40 rounded-lg border border-white/10 hover:border-white/30"
                                                title="GitHub"
                                            >
                                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/in/syed-muhammad-hassan-aa112928b/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-[#0a66c2] transition-colors p-2 bg-black/40 rounded-lg border border-white/10 hover:border-white/30"
                                                title="LinkedIn"
                                            >
                                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">Powered By</span>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    {TECH_STACK.map((tech) => (
                                        <a
                                            key={tech.name}
                                            href={tech.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white/5 border border-white/5 rounded-lg p-2.5 hover:bg-white/10 hover:border-white/15 transition-all group"
                                        >
                                            <span className="text-white text-xs font-bold group-hover:text-orange-400 transition-colors">{tech.name}</span>
                                            <span className="text-gray-600 text-[10px] block font-mono">{tech.desc}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Libraries */}
                            <div>
                                <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">Libraries</span>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {LIBRARIES.map((lib) => (
                                        <span
                                            key={lib}
                                            className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-gray-400 border border-white/5"
                                        >
                                            {lib}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* AI Assistance */}
                            <div>
                                <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">AI Pair Programming</span>
                                <div className="mt-2 bg-white/5 border border-white/5 rounded-lg p-2.5">
                                    <span className="text-white text-xs font-bold">Gemini</span>
                                    <span className="text-gray-600 text-[10px] block font-mono">Google DeepMind — Antigravity</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 flex justify-between items-center">
                            <a
                                href="https://github.com/Muhammad-Hassan12/GitGalaxy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-400 text-xs font-mono transition-colors"
                            >
                                View Source ↗
                            </a>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-white/10 hover:bg-white/15 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
