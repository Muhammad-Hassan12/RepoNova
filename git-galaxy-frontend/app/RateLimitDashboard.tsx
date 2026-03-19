"use client";

import { useState, useEffect } from "react";
import { RateLimitDashboardProps } from "./types";

export default function RateLimitDashboard({ apiUrl }: RateLimitDashboardProps) {
    const [limit, setLimit] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [resetAt, setResetAt] = useState(0);

    useEffect(() => {
        const fetchLimit = () => {
            fetch(`${apiUrl}/api/rate-limit`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.error) {
                        setLimit(data.limit || 0);
                        setRemaining(data.remaining || 0);
                        setResetAt(data.reset_at || 0);
                    }
                })
                .catch(() => {});
        };

        fetchLimit();
        const interval = setInterval(fetchLimit, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [apiUrl]);

    if (limit === 0) return null;

    const percentage = Math.round((remaining / limit) * 100);
    const resetDate = new Date(resetAt * 1000);
    const minutesUntilReset = Math.max(0, Math.round((resetDate.getTime() - Date.now()) / 60000));

    const barColor = percentage > 50 ? "#22c55e" : percentage > 20 ? "#eab308" : "#ef4444";

    return (
        <div className="absolute right-6 bottom-6 z-10 pointer-events-auto">
            <div className="backdrop-blur-md bg-black/40 border border-white/10 p-3 rounded-xl shadow-lg text-xs font-mono min-w-[180px]">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px]">API Quota</span>
                    <span className="text-white font-bold">{remaining}/{limit}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: barColor }}
                    />
                </div>
                <div className="text-gray-500 text-[10px] mt-1.5">
                    Resets in {minutesUntilReset}m
                </div>
            </div>
        </div>
    );
}
