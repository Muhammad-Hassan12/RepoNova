"use client";

import { useEffect, useRef, useCallback } from "react";
import { CelestialBody } from "./types";

// Map language colors to frequencies for a spacey feel
function colorToFrequency(color: string): number {
    // Parse hex color to determine pitch
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const avg = (r + g + b) / 3;
    return 80 + (avg / 255) * 520;
}

interface SoundEngineProps {
    enabled: boolean;
    focusedBody: CelestialBody | null;
}

export default function SoundEngine({ enabled, focusedBody }: SoundEngineProps) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const ambientRef = useRef<OscillatorNode | null>(null);
    const ambient2Ref = useRef<OscillatorNode | null>(null);
    const ambientGainRef = useRef<GainNode | null>(null);
    const ambient2GainRef = useRef<GainNode | null>(null);
    const focusOscRef = useRef<OscillatorNode | null>(null);
    const focusGainRef = useRef<GainNode | null>(null);

    const startAmbient = useCallback(() => {
        if (audioCtxRef.current) return;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Ambient drone: very quiet low-frequency oscillator
        const ambientGain = ctx.createGain();
        ambientGain.gain.value = 0.03;
        ambientGain.connect(ctx.destination);
        ambientGainRef.current = ambientGain;

        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 55; // Low A
        osc.connect(ambientGain);
        osc.start();
        ambientRef.current = osc;

        // second detuned oscillator for depth
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 55.5;
        const gain2 = ctx.createGain();
        gain2.gain.value = 0.02;
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        ambient2Ref.current = osc2;
        ambient2GainRef.current = gain2;
    }, []);

    const stopAmbient = useCallback(() => {
        if (ambientRef.current) {
            ambientRef.current.stop();
            ambientRef.current = null;
        }
        if (ambient2Ref.current) {
            ambient2Ref.current.stop();
            ambient2Ref.current = null;
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
        }
        ambientGainRef.current = null;
        ambient2GainRef.current = null;
    }, []);

    // Start/stop ambient based on enabled
    useEffect(() => {
        if (enabled) {
            startAmbient();
        } else {
            stopAmbient();
        }
        return () => stopAmbient();
    }, [enabled, startAmbient, stopAmbient]);

    // Focus tone: when a star is focused, play its language-based tone
    useEffect(() => {
        if (!audioCtxRef.current || !focusedBody) {
            if (focusOscRef.current) {
                focusOscRef.current.stop();
                focusOscRef.current = null;
            }
            return;
        }

        // Clean previous
        if (focusOscRef.current) {
            focusOscRef.current.stop();
        }

        const ctx = audioCtxRef.current;
        const freq = colorToFrequency(focusedBody.color);

        const gain = ctx.createGain();
        gain.gain.value = 0;
        gain.connect(ctx.destination);
        focusGainRef.current = gain;

        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start();
        focusOscRef.current = osc;

        // Fade in
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);

        return () => {
            if (focusGainRef.current) {
                focusGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current?.currentTime ? audioCtxRef.current.currentTime + 0.3 : 0);
            }
            setTimeout(() => {
                if (focusOscRef.current) {
                    try { focusOscRef.current.stop(); } catch { /* already stopped */ }
                    focusOscRef.current = null;
                }
            }, 400);
        };
    }, [focusedBody]);

    // This component renders nothing visually
    return null;
}
