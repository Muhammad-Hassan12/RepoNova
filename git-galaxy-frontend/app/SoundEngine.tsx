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
    const masterGainRef = useRef<GainNode | null>(null);
    const compressorRef = useRef<DynamicsCompressorNode | null>(null);
    const ambientRef = useRef<OscillatorNode | null>(null);
    const ambient2Ref = useRef<OscillatorNode | null>(null);
    const ambient3Ref = useRef<OscillatorNode | null>(null);
    const ambientGainRef = useRef<GainNode | null>(null);
    const ambient2GainRef = useRef<GainNode | null>(null);
    const ambient3GainRef = useRef<GainNode | null>(null);
    const focusOscRef = useRef<OscillatorNode | null>(null);
    const focusGainRef = useRef<GainNode | null>(null);

    const startAmbient = useCallback(() => {
        if (audioCtxRef.current) return;

        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Master Compressor and Gain Setup
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        compressorRef.current = compressor;

        const masterGain = ctx.createGain();
        masterGain.gain.value = 1.0;
        masterGainRef.current = masterGain;

        compressor.connect(masterGain);
        masterGain.connect(ctx.destination);

        // Ambient drone: low-frequency oscillator
        const ambientGain = ctx.createGain();
        ambientGain.gain.value = 0.08;
        ambientGain.connect(compressor);
        ambientGainRef.current = ambientGain;

        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 110; // Low A octave up
        osc.connect(ambientGain);
        osc.start();
        ambientRef.current = osc;

        // Second detuned oscillator for depth
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 111.5;
        const gain2 = ctx.createGain();
        gain2.gain.value = 0.05;
        osc2.connect(gain2);
        gain2.connect(compressor);
        osc2.start();
        ambient2Ref.current = osc2;
        ambient2GainRef.current = gain2;

        // Third oscillator: sawtooth providing harmonics for small speakers
        const osc3 = ctx.createOscillator();
        osc3.type = "sawtooth";
        osc3.frequency.value = 110;
        const gain3 = ctx.createGain();
        gain3.gain.value = 0.015; // Keep it subtle so it feels deep, not buzzy
        
        // Lowpass filter to tame high-end harshness from sawtooth
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400;

        osc3.connect(filter);
        filter.connect(gain3);
        gain3.connect(compressor);
        osc3.start();
        ambient3Ref.current = osc3;
        ambient3GainRef.current = gain3;
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
        if (ambient3Ref.current) {
            ambient3Ref.current.stop();
            ambient3Ref.current = null;
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
        }
        ambientGainRef.current = null;
        ambient2GainRef.current = null;
        ambient3GainRef.current = null;
        compressorRef.current = null;
        masterGainRef.current = null;
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
        // Connect to compressor if available to prevent clipping, otherwise destination
        if (compressorRef.current) {
            gain.connect(compressorRef.current);
        } else {
            gain.connect(ctx.destination);
        }
        focusGainRef.current = gain;

        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start();
        focusOscRef.current = osc;

        // Fade in
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.5);

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
