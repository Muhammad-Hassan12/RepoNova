"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CelestialBody } from "./types";
import BlackHole from "./BlackHole";
import StarSystem from "./StarSystem";
import ContributionNebula from "./ContributionNebula";
import GravitationalLanes from "./GravitationalLanes";
import StarInfoPanel from "./StarInfoPanel";
import SoundEngine from "./SoundEngine";
import SearchFilter from "./SearchFilter";
import RateLimitDashboard from "./RateLimitDashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const LOADING_STAGES = [
    "Initializing Cosmic Engine...",
    "Connecting to GitHub Nebula...",
    "Scanning repositories...",
    "Mapping celestial bodies...",
    "Calibrating star positions...",
    "Rendering Galaxy...",
];

export default function GalaxyScene({ username }: { username: string }) {
    const [bodies, setBodies] = useState<CelestialBody[]>([]);
    const [filteredBodies, setFilteredBodies] = useState<CelestialBody[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingStage, setLoadingStage] = useState(0);

    // High-resolution export state
    const [exportDpr, setExportDpr] = useState<number | null>(null);

    // Listen for export events to temporarily boost resolution
    useEffect(() => {
        const handleStart = () => setExportDpr(3);
        const handleEnd = () => setExportDpr(null);
        window.addEventListener('start-high-res-export', handleStart);
        window.addEventListener('end-high-res-export', handleEnd);
        return () => {
            window.removeEventListener('start-high-res-export', handleStart);
            window.removeEventListener('end-high-res-export', handleEnd);
        };
    }, []);

    // Targeting Computer State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [focusedRepo, setFocusedRepo] = useState<string | null>(null);

    // Sound state
    const [soundEnabled, setSoundEnabled] = useState(false);

    // Keyboard shortcuts overlay
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Mobile specific HUD stat toggles
    const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false);

    // Animated loading stages
    useEffect(() => {
        if (!loading) return;
        const interval = setInterval(() => {
            setLoadingStage((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
        }, 600);
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setError(null);
        setLoading(true);
        setLoadingStage(0);
        fetch(`${API_URL}/api/galaxy/${username}`, { signal })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        throw new Error(data.error || `HTTP ${res.status}`);
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else if (data.celestial_bodies) {
                    setBodies(data.celestial_bodies);
                    setFilteredBodies(data.celestial_bodies);
                }
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                    return;
                }
                console.error("Failed to fetch galaxy data:", err);
                setError(err.message || "Failed to connect to the Cosmic Engine. Is the backend running?");
                setLoading(false);
            });

        return () => {
            controller.abort();
        };
    }, [username]);

    const totalMass = useMemo(() => bodies.reduce((sum, body) => sum + body.mass, 0), [bodies]);
    const rawScale = Math.log10(totalMass || 10) * 0.7;
    const bhScaleMultiplier = Math.max(1, Math.min(3, rawScale));
    const safeOrbitDistance = (15 * bhScaleMultiplier) + 15;

    const galaxyStats = useMemo(() => {
        let totalStars = 0;
        let totalCommits = 0;
        let totalForks = 0;
        const languageCounts: Record<string, number> = {};

        bodies.forEach((body) => {
            totalStars += body.stars ?? (body.mass === 5 ? 0 : body.mass / 2);
            totalCommits += body.orbiting_particles;
            totalForks += body.forks ?? 0;
            if (body.language && body.language !== "Unknown") {
                languageCounts[body.language] = (languageCounts[body.language] || 0) + 1;
            }
        });

        const topLanguages = Object.entries(languageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        return { totalStars, totalCommits, totalForks, topLanguages, repoCount: bodies.length };
    }, [bodies]);

    // Find the focused body for the info panel
    const focusedBody = useMemo(() => {
        if (!focusedRepo || focusedRepo === "BLACK_HOLE") return null;
        return bodies.find((b) => b.repo_name === focusedRepo) || null;
    }, [bodies, focusedRepo]);

    const handleFilterChange = useCallback((filtered: CelestialBody[]) => {
        setFilteredBodies(filtered);
    }, []);

    // Warp to random star
    const warpToRandom = useCallback(() => {
        if (bodies.length === 0) return;
        const randomIndex = Math.floor(Math.random() * bodies.length);
        setIsFocusMode(true);
        setFocusedRepo(bodies[randomIndex].repo_name);
    }, [bodies]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case "r":
                    warpToRandom();
                    break;
                case "escape":
                    setFocusedRepo("BLACK_HOLE");
                    break;
                case "?":
                    setShowShortcuts((prev) => !prev);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [warpToRandom]);

    // Loading state
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-white bg-black font-mono">
                <div className="text-center max-w-sm">
                    {/* Animated rings */}
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-2 border-orange-500/30 rounded-full animate-ping" style={{ animationDuration: "2s" }}></div>
                        <div className="absolute inset-2 border-2 border-orange-400/40 rounded-full animate-ping" style={{ animationDuration: "1.5s" }}></div>
                        <div className="absolute inset-4 border-2 border-yellow-500/50 rounded-full animate-ping" style={{ animationDuration: "1s" }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full shadow-[0_0_30px_rgba(255,136,0,0.6)] animate-pulse"></div>
                        </div>
                    </div>

                    {/* Stage text */}
                    <p className="text-orange-400 text-lg font-bold mb-3 tracking-wide">
                        {LOADING_STAGES[loadingStage]}
                    </p>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-1.5 mb-4">
                        {LOADING_STAGES.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= loadingStage
                                    ? "bg-orange-500 shadow-[0_0_6px_rgba(255,136,0,0.6)]"
                                    : "bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>

                    <p className="text-gray-600 text-xs">Mapping universe for @{username}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-white bg-black font-mono">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">💫</div>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Cosmic Engine Error</h2>
                    <p className="text-gray-400 leading-relaxed">{error}</p>
                    <p className="text-gray-600 text-sm mt-4">Check that the backend is running on {API_URL}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-black relative">
            <Canvas
                camera={{ position: [0, 80, 180], fov: 60 }}
                gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
                dpr={exportDpr || [1, 2]}
            >
                <Stars radius={300} depth={50} count={10000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 0, 0]} intensity={3} color="#ffaa00" distance={200} />

                <OrbitControls makeDefault enablePan={true} enableZoom={true} enableRotate={true} />

                <BlackHole
                    username={username}
                    totalMass={totalMass}
                    isFocusMode={isFocusMode}
                    focusedRepo={focusedRepo}
                    setFocusedRepo={setFocusedRepo}
                />

                {/* Contribution Nebula */}
                <ContributionNebula username={username} scaleMultiplier={bhScaleMultiplier} />

                {/* Gravitational Lanes */}
                <GravitationalLanes bodies={bodies} />

                {filteredBodies.map((body) => (
                    <StarSystem
                        key={body.repo_name}
                        body={body}
                        username={username}
                        safeOrbitDistance={safeOrbitDistance}
                        isFocusMode={isFocusMode}
                        setIsFocusMode={setIsFocusMode}
                        focusedRepo={focusedRepo}
                        setFocusedRepo={setFocusedRepo}
                    />
                ))}

                <EffectComposer enableNormalPass={false}>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
                </EffectComposer>
            </Canvas>

            {/* Sound Engine (non-visual) */}
            <SoundEngine enabled={soundEnabled} focusedBody={focusedBody} />

            {/* Star Info Panel (when locked on) */}
            {isFocusMode && focusedBody && (
                <StarInfoPanel
                    body={focusedBody}
                    username={username}
                    onClose={() => setFocusedRepo(null)}
                />
            )}

            {/* THE HUD SIDE PANEL */}
            {bodies.length > 0 && (
                <>
                    {/* Mobile Toggle Button */}
                    <button
                        onClick={() => setIsMobileStatsOpen(true)}
                        className="absolute left-3 top-[110px] z-[60] sm:hidden backdrop-blur-md bg-black/40 border border-white/10 px-2 py-1 text-white font-bold text-[10px] shadow-[0_0_20px_rgba(255,136,0,0.15)] rounded-lg pointer-events-auto flex items-center gap-1.5 transition-colors hover:bg-black/60"
                    >
                        <span>📊 Stats</span>
                    </button>

                    <div className={`absolute left-0 sm:left-6 top-0 sm:top-32 w-[75vw] max-w-[280px] sm:w-72 h-full sm:h-auto z-50 sm:z-10 pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileStatsOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
                        <div className="backdrop-blur-3xl sm:backdrop-blur-md bg-black/90 sm:bg-black/40 border-r sm:border border-white/20 sm:border-white/10 p-4 sm:p-6 sm:rounded-2xl shadow-[15px_0_30px_rgba(0,0,0,0.7)] sm:shadow-[0_0_20px_rgba(255,136,0,0.15)] pointer-events-auto h-full sm:h-auto overflow-y-auto">
                            <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest mt-4 sm:mt-0">
                                    Galaxy Stats
                                </h2>
                                <button
                                    onClick={() => setIsMobileStatsOpen(false)}
                                    className="sm:hidden text-gray-400 hover:text-white text-2xl leading-none p-1"
                                    aria-label="Close Stats Panel"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 font-mono text-sm pb-8 sm:pb-0">
                            <div className="flex justify-between items-center bg-white/5 p-2.5 sm:p-3 rounded-lg border border-white/5">
                                <span className="text-gray-400">Repositories</span>
                                <span className="text-white font-bold text-base sm:text-lg">{galaxyStats.repoCount}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2.5 sm:p-3 rounded-lg border border-white/5">
                                <span className="text-gray-400">Total Stars</span>
                                <span className="text-yellow-400 font-bold text-base sm:text-lg">⭐ {galaxyStats.totalStars}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2.5 sm:p-3 rounded-lg border border-white/5">
                                <span className="text-gray-400">Total Forks</span>
                                <span className="text-green-400 font-bold text-base sm:text-lg">🍴 {galaxyStats.totalForks}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-2.5 sm:p-3 rounded-lg border border-white/5">
                                <span className="text-gray-400">Total Commits</span>
                                <span className="text-blue-400 font-bold text-base sm:text-lg">☄️ {galaxyStats.totalCommits}</span>
                            </div>

                            {/* Top Languages */}
                            {galaxyStats.topLanguages.length > 0 && (
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider">Top Languages</span>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {galaxyStats.topLanguages.map(([lang, count]) => (
                                            <span key={lang} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white">
                                                {lang} ({count})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Warp to Random Star */}
                            <div className="mt-6 border-t border-white/20 pt-4">
                                <button
                                    onClick={warpToRandom}
                                    className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                                >
                                    🌀 Warp to Random Star
                                    <span className="text-gray-500 font-normal">[R]</span>
                                </button>
                            </div>

                            {/* Sound Toggle */}
                            <div className="border-t border-white/20 pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm font-mono uppercase">🔊 Sound</span>
                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${soundEnabled ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                                    >
                                        {soundEnabled ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            </div>

                            {/* Keyboard Shortcuts Hint */}
                            <div className="text-center hidden sm:block">
                                <button
                                    onClick={() => setShowShortcuts(!showShortcuts)}
                                    className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                                >
                                    Press ? for keyboard shortcuts
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}

            {/* Search/Filter Panel */}
            {bodies.length > 0 && (
                <div className="hidden sm:block">
                    <SearchFilter bodies={bodies} onFilterChange={handleFilterChange} />
                </div>
            )}

            {/* Rate Limit Dashboard */}
            <div>
                <RateLimitDashboard apiUrl={API_URL} />
            </div>

            {/* Keyboard Shortcuts Overlay */}
            {showShortcuts && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
                    <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-[0_0_40px_rgba(255,136,0,0.2)] animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold text-lg uppercase tracking-widest">Keyboard Shortcuts</h3>
                            <button onClick={() => setShowShortcuts(false)} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
                        </div>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Warp to random star</span>
                                <kbd className="bg-white/10 border border-white/20 px-2 py-1 rounded text-orange-400 text-xs">R</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Reset view</span>
                                <kbd className="bg-white/10 border border-white/20 px-2 py-1 rounded text-orange-400 text-xs">Esc</kbd>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Toggle shortcuts</span>
                                <kbd className="bg-white/10 border border-white/20 px-2 py-1 rounded text-orange-400 text-xs">?</kbd>
                            </div>
                        </div>
                        <p className="text-gray-600 text-xs mt-6 text-center">Click outside to close</p>
                    </div>
                </div>
            )}
        </div>
    );
}