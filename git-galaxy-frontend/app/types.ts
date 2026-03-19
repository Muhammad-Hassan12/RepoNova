import * as THREE from "three";

// --- API Response Types ---

export interface CelestialBody {
    repo_name: string;
    description: string;
    language: string;
    color: string;
    mass: number;
    orbiting_particles: number;
    open_prs: number;
    open_issues: number;
    forks: number;
    stars: number;
    updated_at: string;
}

export interface GalaxyApiResponse {
    username: string;
    engine_status: string;
    message: string;
    total_repos: number;
    celestial_bodies: CelestialBody[];
    error?: string;
}

export interface ContributionDay {
    contributionCount: number;
    date: string;
    color: string;
}

export interface ContributionWeek {
    contributionDays: ContributionDay[];
}

export interface ContributionsApiResponse {
    username: string;
    total_contributions: number;
    weeks: ContributionWeek[];
    error?: string;
}

export interface RateLimitApiResponse {
    limit: number;
    remaining: number;
    reset_at: number;
    error?: string;
}

export interface UserProfile {
    username: string;
    avatar_url: string;
    name: string;
    bio: string;
    company: string;
    location: string;
    followers: number;
    following: number;
}

// --- Component Prop Types ---

export interface GalaxySceneProps {
    username: string;
}

export interface BlackHoleProps {
    username: string;
    totalMass: number;
    isFocusMode: boolean;
    focusedRepo: string | null;
    setFocusedRepo: (repo: string | null) => void;
}

export interface StarSystemProps {
    body: CelestialBody;
    username: string;
    safeOrbitDistance: number;
    isFocusMode: boolean;
    focusedRepo: string | null;
    setFocusedRepo: (repo: string | null) => void;
}

export interface CometProps {
    radiusX: number;
    radiusZ: number;
    speed: number;
    angle: number;
    tilt: number;
}

export interface ContributionNebulaProps {
    username: string;
    scaleMultiplier: number;
}

export interface GravitationalLanesProps {
    bodies: CelestialBody[];
}

export interface StarInfoPanelProps {
    body: CelestialBody | null;
    username: string;
    onClose: () => void;
}

export interface SearchFilterProps {
    bodies: CelestialBody[];
    onFilterChange: (filtered: CelestialBody[]) => void;
}

export interface RateLimitDashboardProps {
    apiUrl: string;
}

export interface ExportButtonProps {
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

// --- Utility: deterministic hash from a string (for seeding random) ---
export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// --- Utility: seeded pseudo-random number generator ---
export function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}