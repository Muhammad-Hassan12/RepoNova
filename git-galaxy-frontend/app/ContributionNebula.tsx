"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ContributionNebulaProps, ContributionDay } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ContributionNebula({ username, scaleMultiplier }: ContributionNebulaProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [days, setDays] = useState<ContributionDay[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/api/contributions/${username}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.weeks) {
                    const allDays: ContributionDay[] = [];
                    data.weeks.forEach((week: { contributionDays: ContributionDay[] }) => {
                        week.contributionDays.forEach((day: ContributionDay) => {
                            if (day.contributionCount > 0) {
                                allDays.push(day);
                            }
                        });
                    });
                    setDays(allDays);
                }
            })
            .catch((err) => {
                console.warn("Failed to fetch contribution data:", err);
            });
    }, [username]);

    const { positions, colors, sizes } = useMemo(() => {
        if (days.length === 0) {
            return {
                positions: new Float32Array(0),
                colors: new Float32Array(0),
                sizes: new Float32Array(0),
            };
        }

        const count = days.length;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const siz = new Float32Array(count);

        const color = new THREE.Color();

        days.forEach((day, i) => {
            // Arrange in a nebula-like cloud around the black hole
            const weekIndex = Math.floor(i / 7);
            const dayIndex = i % 7;
            const angle = (weekIndex / 52) * Math.PI * 2;
            const radiusBase = 18 + (dayIndex * 2);
            const jitterX = (Math.sin(i * 137.508) * 0.5) * 5;
            const jitterY = (Math.cos(i * 97.3) * 0.5) * 4;
            const jitterZ = (Math.sin(i * 53.7) * 0.5) * 5;

            pos[i * 3] = Math.cos(angle) * radiusBase + jitterX;
            pos[i * 3 + 1] = jitterY;
            pos[i * 3 + 2] = Math.sin(angle) * radiusBase + jitterZ;

            // Color: scale from dark green (#0e4429) to bright green (#39d353) to white
            const intensity = Math.min(1, day.contributionCount / 15);
            if (intensity < 0.5) {
                color.setHSL(0.35, 0.8, 0.15 + intensity * 0.5);
            } else {
                color.setHSL(0.35, 0.8 - (intensity - 0.5) * 1.2, 0.4 + (intensity - 0.5) * 0.6);
            }
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;

            siz[i] = 0.5 + intensity * 2;
        });

        return { positions: pos, colors: col, sizes: siz };
    }, [days]);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.02;
        }
    });

    if (days.length === 0) return null;

    return (
        <group scale={[scaleMultiplier * 0.8, scaleMultiplier * 0.5, scaleMultiplier * 0.8]}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={days.length}
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={days.length}
                        args={[colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={1.5}
                    vertexColors
                    transparent
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>
        </group>
    );
}
