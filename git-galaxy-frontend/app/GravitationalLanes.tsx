"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GravitationalLanesProps, hashString, seededRandom } from "./types";

/**
 * Draws faint glowing orbital rings for each language group.
 * Same-language repos orbit on the same ring.
 */
export default function GravitationalLanes({ bodies }: GravitationalLanesProps) {
    const groupRef = useRef<THREE.Group>(null);

    const lanes = useMemo(() => {
        // Group repos by language
        const langGroups: Record<string, { color: string; count: number }> = {};
        bodies.forEach((body) => {
            if (body.language && body.language !== "Unknown") {
                if (!langGroups[body.language]) {
                    langGroups[body.language] = { color: body.color, count: 0 };
                }
                langGroups[body.language].count += 1;
            }
        });

        // Only show lanes for languages with 2+ repos
        return Object.entries(langGroups)
            .filter(([, group]) => group.count >= 2)
            .map(([lang, group], index) => {
                const seed = hashString(lang);
                const rng = seededRandom(seed);
                const radius = 30 + index * 15 + rng() * 10;
                const tilt = (rng() - 0.5) * 0.3;
                return {
                    language: lang,
                    color: group.color,
                    radius,
                    tilt,
                    count: group.count,
                };
            });
    }, [bodies]);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.01;
        }
    });

    if (lanes.length === 0) return null;

    return (
        <group ref={groupRef}>
            {lanes.map((lane) => (
                <mesh key={lane.language} rotation={[Math.PI / 2 + lane.tilt, 0, 0]}>
                    <ringGeometry args={[lane.radius - 0.3, lane.radius + 0.3, 128]} />
                    <meshBasicMaterial
                        color={lane.color}
                        transparent
                        opacity={0.12}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}
