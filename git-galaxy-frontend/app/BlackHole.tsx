"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { BlackHoleProps } from "./types";

export default function BlackHole({ username, totalMass, isFocusMode, focusedRepo, setFocusedRepo }: BlackHoleProps) {
    const innerDiskRef = useRef<THREE.Mesh>(null);
    const outerDiskRef = useRef<THREE.Mesh>(null);
    const dustRef = useRef<THREE.Points>(null);
    const warpTimerRef = useRef(0);

    const { camera, controls } = useThree();
    const centerVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);
    const defaultCamPos = useMemo(() => new THREE.Vector3(0, 80, 180), []);

    const [hovered, setHovered] = useState(false);

    const scaleMultiplier = Math.max(1, Math.log10(totalMass || 10) * 0.7);

    const dustPositions = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 15 + 6;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return positions;
    }, []);

    useEffect(() => {
        if (focusedRepo === "BLACK_HOLE") {
            warpTimerRef.current = 0;
        }
    }, [focusedRepo]);

    useFrame((_, delta) => {
        if (innerDiskRef.current) innerDiskRef.current.rotation.z -= delta * 0.5;
        if (outerDiskRef.current) outerDiskRef.current.rotation.z -= delta * 0.2;
        if (dustRef.current) dustRef.current.rotation.y -= delta * 0.3;
        if (focusedRepo === "BLACK_HOLE") {
            const controlsRef = controls as unknown as { target: THREE.Vector3; update: () => void };
            if (controlsRef?.target) {
                controlsRef.target.lerp(centerVec, 0.05);
                controlsRef.update();
            }

            warpTimerRef.current += delta;
            if (warpTimerRef.current < 2.0) {
                camera.position.lerp(defaultCamPos, 0.05);
            }
        }
    });

    return (
        <group scale={[scaleMultiplier, scaleMultiplier, scaleMultiplier]}>
            <mesh
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFocusMode) {
                        setFocusedRepo("BLACK_HOLE");
                    } else {
                        window.open(`https://github.com/${username}`, "_blank");
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
                <sphereGeometry args={[4, 64, 64]} />
                <meshBasicMaterial color="black" />
            </mesh>

            <mesh>
                <sphereGeometry args={[4.2, 64, 64]} />
                <meshBasicMaterial color="#ff4400" transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>

            <group rotation={[Math.PI / 2.1, 0, 0]}>
                <mesh ref={innerDiskRef}>
                    <ringGeometry args={[4.5, 8, 64]} />
                    <meshBasicMaterial color="#ffbb00" transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                </mesh>
                <mesh ref={outerDiskRef} position={[0, 0, -0.01]}>
                    <ringGeometry args={[7.5, 14, 64]} />
                    <meshBasicMaterial color="#ff4400" transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                </mesh>
            </group>

            <points ref={dustRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={2000} args={[dustPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.15} color="#ffaa00" transparent opacity={0.6} blending={THREE.AdditiveBlending} sizeAttenuation />
            </points>

            <mesh position={[0, 8, 0]}>
                <coneGeometry args={[2, 15, 32, 1, true]} />
                <meshBasicMaterial color="#ff2200" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -8, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[2, 15, 32, 1, true]} />
                <meshBasicMaterial color="#ff2200" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
            </mesh>

            {hovered && (
                <Html style={{ pointerEvents: "none" }} position={[0, 10, 0]} center zIndexRange={[100, 0]}>
                    <div className="bg-black/90 border border-orange-500/50 p-4 rounded-xl text-white backdrop-blur-md min-w-[220px] text-center transform transition-all duration-300 scale-100">
                        <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-200 mb-1 tracking-wider uppercase">
                            Supermassive Core
                        </h3>
                        <p className="text-gray-300 font-mono">@{username}</p>
                        <div className="mt-3 pt-3 border-t border-orange-500/30 flex justify-center space-x-4 text-sm">
                            <span className="text-orange-300 animate-pulse">Total Mass: {totalMass}</span>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}