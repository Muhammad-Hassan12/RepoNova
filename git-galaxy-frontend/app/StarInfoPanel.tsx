"use client";

import { StarInfoPanelProps } from "./types";

export default function StarInfoPanel({ body, username, onClose }: StarInfoPanelProps) {
    if (!body) return null;

    const stars = body.stars ?? (body.mass === 5 ? 0 : body.mass / 2);

    return (
        <div className="fixed sm:absolute inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-32 w-full sm:w-80 z-50 sm:z-20 animate-fadeIn max-h-[60vh] sm:max-h-none overflow-y-auto drop-shadow-[0_-15px_30px_rgba(0,0,0,0.8)] sm:drop-shadow-none">
            <div className="backdrop-blur-2xl bg-black/80 sm:bg-black/60 border-t sm:border border-white/20 sm:border-white/10 rounded-t-3xl sm:rounded-2xl shadow-[0_0_30px_rgba(255,136,0,0.2)] overflow-hidden">
                {/* Header */}
                <div className="p-3 sm:p-5 border-b border-white/10" style={{ borderTopColor: body.color, borderTopWidth: 3 }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">{body.repo_name}</h2>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-mono"
                                style={{ backgroundColor: body.color + "30", color: body.color, border: `1px solid ${body.color}50` }}>
                                {body.language}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
                            aria-label="Close panel"
                        >
                            ✕
                        </button>
                    </div>
                    {body.description && (
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">{body.description}</p>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="p-3 sm:p-5 grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Stars</span>
                        <div className="text-yellow-400 font-bold text-sm sm:text-lg mt-1">⭐ {stars}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Forks</span>
                        <div className="text-green-400 font-bold text-sm sm:text-lg mt-1">🍴 {body.forks ?? 0}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Commits</span>
                        <div className="text-blue-400 font-bold text-sm sm:text-lg mt-1">☄️ {body.orbiting_particles}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Open PRs</span>
                        <div className="text-cyan-400 font-bold text-sm sm:text-lg mt-1">🚀 {body.open_prs}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Issues</span>
                        <div className="text-amber-400 font-bold text-sm sm:text-lg mt-1">🐛 {body.open_issues ?? 0}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Mass</span>
                        <div className="text-orange-400 font-bold text-sm sm:text-lg mt-1">🪐 {body.mass}</div>
                    </div>
                </div>

                {/* Updated At */}
                {body.updated_at && (
                    <div className="px-3 sm:px-5 pb-3 text-xs text-gray-500 font-mono">
                        Last updated: {new Date(body.updated_at).toLocaleDateString()}
                    </div>
                )}

                {/* Actions */}
                <div className="p-3 sm:p-5 border-t border-white/10">
                    <a
                        href={`https://github.com/${username}/${body.repo_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white py-2.5 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(255,136,0,0.3)] hover:shadow-[0_0_25px_rgba(255,136,0,0.5)]"
                    >
                        View on GitHub →
                    </a>
                </div>
            </div>
        </div>
    );
}
