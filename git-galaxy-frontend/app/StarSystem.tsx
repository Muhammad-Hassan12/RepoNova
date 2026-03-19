"use client";

import { useState, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { StarSystemProps, CometProps, hashString, seededRandom } from "./types";

function Comet({ radiusX, radiusZ, speed, angle, tilt }: CometProps) {
    const cometRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + angle;
        if (cometRef.current) {
            cometRef.current.position.x = Math.cos(t) * radiusX;
            cometRef.current.position.z = Math.sin(t) * radiusZ;
        }
    });
    return (
        <group rotation={[tilt, 0, tilt]}>
            <mesh ref={cometRef}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} toneMapped={false} />
            </mesh>
        </group>
    );
}

export default function StarSystem({ body, username, safeOrbitDistance, isFocusMode, focusedRepo, setFocusedRepo }: StarSystemProps) {
    const orbitCenterRef = useRef<THREE.Group>(null);
    const starGroupRef = useRef<THREE.Group>(null);
    const asteroidsRef = useRef<THREE.Points>(null);

    const { camera, controls } = useThree();
    const targetVec = useMemo(() => new THREE.Vector3(), []);
    // Pre-allocate offset vector outside the frame loop to prevent memory leaks
    const offsetVec = useMemo(() => new THREE.Vector3(), []);
    // Pre-allocate desired position vector to avoid per-frame allocation
    const desiredPosVec = useMemo(() => new THREE.Vector3(), []);

    const [hovered, setHovered] = useState(false);

    const rawRadius = Math.log10(body.mass) * 1.5;
    const starRadius = Math.max(1.5, Math.min(5.5, rawRadius));
    const particlesCount = Math.min(400, body.orbiting_particles);
    const cometCount = Math.min(5, body.open_prs || 0);

    // Deterministic layout: seed random from repo name hash
    const { orbitRadius, startAngle, orbitSpeed, yOffset } = useMemo(() => {
        const seed = hashString(body.repo_name);
        const rng = seededRandom(seed);
        const radius = rng() * 80 + safeOrbitDistance;
        const angle = rng() * Math.PI * 2;
        const speed = (rng() * 0.002 + 0.0005) * (rng() > 0.5 ? 1 : -1);
        const y = (rng() - 0.5) * 10;
        return { orbitRadius: radius, startAngle: angle, orbitSpeed: speed, yOffset: y };
    }, [safeOrbitDistance, body.repo_name]);

    const baseAsteroidRadius = starRadius + 1.5;

    const asteroidPositions = useMemo(() => {
        const seed = hashString(body.repo_name + "_asteroids");
        const rng = seededRandom(seed);
        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const angle = rng() * Math.PI * 2;
            const radius = baseAsteroidRadius + rng() * 4;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (rng() - 0.5) * 2;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return positions;
    }, [particlesCount, baseAsteroidRadius, body.repo_name]);

    const comets = useMemo(() => {
        const seed = hashString(body.repo_name + "_comets");
        const rng = seededRandom(seed);
        return Array.from({ length: cometCount }).map(() => ({
            radiusX: starRadius + rng() * 8 + 4,
            radiusZ: starRadius + rng() * 2 + 1,
            speed: rng() * 2 + 1,
            angle: rng() * Math.PI * 2,
            tilt: (rng() - 0.5) * Math.PI,
        }));
    }, [cometCount, starRadius, body.repo_name]);

    // THE TRACKING LOOP
    useFrame(() => {
        if (orbitCenterRef.current) orbitCenterRef.current.rotation.y += orbitSpeed;
        if (starGroupRef.current) starGroupRef.current.rotation.y += 0.01;
        if (asteroidsRef.current) asteroidsRef.current.rotation.y += 0.005;

        // If this star is locked on, pull the camera to it
        if (focusedRepo === body.repo_name && starGroupRef.current) {
            starGroupRef.current.getWorldPosition(targetVec);

            const controlsRef = controls as unknown as { target: THREE.Vector3; update: () => void };
            if (controlsRef?.target) {
                controlsRef.target.lerp(targetVec, 0.05);
                controlsRef.update();
            }

            // Use pre-allocated vector to avoid memory allocation every frame
            offsetVec.set(starRadius * 4, starRadius * 3, starRadius * 5);
            desiredPosVec.copy(targetVec).add(offsetVec);
            camera.position.lerp(desiredPosVec, 0.05);
        }
    });

    return (
        <group ref={orbitCenterRef} rotation={[0, startAngle, 0]}>
            <group position={[orbitRadius, yOffset, 0]} ref={starGroupRef}>
                <mesh
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isFocusMode) {
                            setFocusedRepo(body.repo_name);
                        } else {
                            window.open(`https://github.com/${username}/${body.repo_name}`, "_blank");
                        }
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setHovered(true);
                        document.body.style.cursor = isFocusMode ? 'crosshair' : 'pointer';
                    }}
                    onPointerOut={() => {
                        setHovered(false);
                        document.body.style.cursor = 'auto';
                    }}
                >
                    <sphereGeometry args={[starRadius, 32, 32]} />
                    <meshStandardMaterial color={body.color} emissive={body.color} emissiveIntensity={hovered ? 4 : 1.5} toneMapped={false} />
                </mesh>

                {hovered && (
                    <Html style={{ pointerEvents: "none" }} position={[0, starRadius + 1.5, 0]} center zIndexRange={[100, 0]}>
                        <div className="bg-black/80 border border-white/20 p-4 rounded-xl text-white backdrop-blur-md min-w-[200px]">
                            <h3 className="font-bold text-xl mb-2 border-b border-white/20 pb-1" style={{ color: body.color }}>{body.repo_name}</h3>
                            <div className="flex flex-col space-y-1 text-sm">
                                <span className="flex justify-between"><span className="text-gray-400">Language:</span> <span className="font-mono">{body.language}</span></span>
                                <span className="flex justify-between"><span className="text-gray-400">Stars:</span> <span>⭐ {body.stars ?? (body.mass === 5 ? 0 : body.mass / 2)}</span></span>
                                <span className="flex justify-between"><span className="text-gray-400">Forks:</span> <span>🍴 {body.forks ?? 0}</span></span>
                                <span className="flex justify-between"><span className="text-gray-400">Commits:</span> <span>☄️ {body.orbiting_particles}</span></span>
                                {body.open_issues > 0 && (
                                    <span className="flex justify-between text-amber-400">
                                        <span>Issues:</span> <span>🐛 {body.open_issues}</span>
                                    </span>
                                )}
                                {body.open_prs > 0 && (
                                    <span className="flex justify-between text-cyan-400 font-bold mt-1 border-t border-white/10 pt-1">
                                        <span>Open PRs:</span> <span>🚀 {body.open_prs}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </Html>
                )}

                {particlesCount > 0 && (
                    <points ref={asteroidsRef}>
                        <bufferGeometry>
                            <bufferAttribute attach="attributes-position" count={particlesCount} args={[asteroidPositions, 3]} />
                        </bufferGeometry>
                        <pointsMaterial size={0.3} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
                    </points>
                )}

                {comets.map((comet, i) => (
                    <Comet key={i} {...comet} />
                ))}
            </group>
        </group>
    );
}