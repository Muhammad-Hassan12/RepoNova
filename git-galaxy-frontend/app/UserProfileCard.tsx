"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function UserProfileCard({ username }: { username: string }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        setProfile(null);
        fetch(`${API_URL}/api/user/${username}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setProfile(data);
                }
            })
            .catch((err) => {
                console.warn("Failed to fetch user profile:", err);
            });
    }, [username]);

    if (!profile) return null;

    return (
        <div className="absolute top-[90px] sm:top-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-fadeIn w-[95vw] sm:w-auto flex justify-center sm:block">
            <div className="pointer-events-auto backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(255,136,0,0.15)] px-3 py-2 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-4 w-full sm:max-w-md">
                {/* Avatar */}
                {profile.avatar_url && (
                    <img
                        src={profile.avatar_url}
                        alt={profile.name || username}
                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-orange-500/40 shadow-[0_0_15px_rgba(255,136,0,0.3)] flex-shrink-0"
                    />
                )}

                {/* Info */}
                <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                        <span className="text-white font-bold text-sm truncate">
                            {profile.name || username}
                        </span>
                        <span className="text-gray-500 font-mono text-xs">@{username}</span>
                    </div>

                    {profile.bio && (
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{profile.bio}</p>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                        <span className="text-gray-400">
                            <span className="text-white font-bold">{profile.followers.toLocaleString()}</span> <span className="hidden sm:inline">followers</span>
                            <span className="inline sm:hidden ml-1">👥</span>
                        </span>
                        <span className="text-gray-400">
                            <span className="text-white font-bold">{profile.following.toLocaleString()}</span> <span className="hidden sm:inline">following</span>
                        </span>
                        {profile.location && (
                            <span className="text-gray-500 hidden sm:inline">📍 {profile.location}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
