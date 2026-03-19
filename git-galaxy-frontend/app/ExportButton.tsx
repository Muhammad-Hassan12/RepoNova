"use client";

import { useCallback, useState } from "react";

export default function ExportButton() {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleExport = useCallback(() => {
        // Find the Three.js canvas in the DOM
        const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
        if (!canvas) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
            return;
        }

        // Use toDataURL to capture the current frame
        try {
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `gitgalaxy-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            setStatus("success");
            setTimeout(() => setStatus("idle"), 2000);
        } catch {
            console.error("Failed to export canvas. If using WebGL, ensure preserveDrawingBuffer is set.");
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    }, []);

    return (
        <button
            onClick={handleExport}
            className={`backdrop-blur-md border px-4 py-2 rounded-full text-sm font-mono transition-all shadow-lg flex items-center gap-2 ${
                status === "success"
                    ? "bg-green-500/20 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    : status === "error"
                    ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    : "bg-black/40 border-white/10 text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            }`}
            title="Export galaxy as PNG"
        >
            {status === "success" ? "✅ Exported!" : status === "error" ? "❌ Failed" : "📸 Export"}
        </button>
    );
}
