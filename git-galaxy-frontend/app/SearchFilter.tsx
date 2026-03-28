"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { CelestialBody, SearchFilterProps } from "./types";

type SortField = "name" | "stars" | "commits" | "updated";

export default function SearchFilter({ bodies, onFilterChange }: SearchFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<SortField>("stars");
    const [isExpanded, setIsExpanded] = useState(false);

    // Extract unique languages
    const languages = useMemo(() => {
        const langSet = new Set<string>();
        bodies.forEach((b) => {
            if (b.language && b.language !== "Unknown") langSet.add(b.language);
        });
        return Array.from(langSet).sort();
    }, [bodies]);

    // Language color map
    const langColors = useMemo(() => {
        const map: Record<string, string> = {};
        bodies.forEach((b) => {
            if (b.language && b.language !== "Unknown") map[b.language] = b.color;
        });
        return map;
    }, [bodies]);

    const toggleLanguage = useCallback((lang: string) => {
        setSelectedLanguages((prev) => {
            const next = new Set(prev);
            if (next.has(lang)) next.delete(lang);
            else next.add(lang);
            return next;
        });
    }, []);

    // Filter and sort
    const filtered = useMemo(() => {
        let result = [...bodies];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter((b) => b.repo_name.toLowerCase().includes(term));
        }

        if (selectedLanguages.size > 0) {
            result = result.filter((b) => selectedLanguages.has(b.language));
        }
        result.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.repo_name.localeCompare(b.repo_name);
                case "stars":
                    return b.stars - a.stars;
                case "commits":
                    return b.orbiting_particles - a.orbiting_particles;
                case "updated":
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                default:
                    return 0;
            }
        });

        return result;
    }, [bodies, searchTerm, selectedLanguages, sortBy]);

    useEffect(() => {
        onFilterChange(filtered);
    }, [filtered, onFilterChange]);

    return (
        <div className="absolute left-6 bottom-6 z-10 pointer-events-auto w-72">
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(255,136,0,0.15)] overflow-hidden">
                {/* Toggle Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                    <span className="text-white font-bold text-sm uppercase tracking-widest">🔭 Filter Stars</span>
                    <span className="text-gray-400 text-xs">
                        {filtered.length}/{bodies.length}
                    </span>
                </button>

                {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                        {/* Search */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search repos..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 outline-none focus:border-orange-500/50"
                        />

                        {/* Sort */}
                        <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-gray-500 text-xs uppercase mr-1">Sort:</span>
                            {(["stars", "commits", "name", "updated"] as SortField[]).map((field) => (
                                <button
                                    key={field}
                                    onClick={() => setSortBy(field)}
                                    className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${sortBy === field
                                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                            : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10"
                                        }`}
                                >
                                    {field}
                                </button>
                            ))}
                        </div>

                        {/* Language chips */}
                        <div className="flex flex-wrap gap-1.5">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => toggleLanguage(lang)}
                                    className={`px-2 py-0.5 rounded-full text-xs font-mono transition-all border ${selectedLanguages.has(lang)
                                            ? "opacity-100 shadow-sm"
                                            : "opacity-50 hover:opacity-80"
                                        }`}
                                    style={{
                                        backgroundColor: selectedLanguages.has(lang) ? langColors[lang] + "30" : "transparent",
                                        color: langColors[lang],
                                        borderColor: langColors[lang] + "50",
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {/* Clear */}
                        {(searchTerm || selectedLanguages.size > 0) && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedLanguages(new Set());
                                }}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
