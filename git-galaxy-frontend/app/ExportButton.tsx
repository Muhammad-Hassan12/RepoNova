"use client";

import { useCallback, useState } from "react";

interface ExportButtonProps {
    username?: string;
}

export default function ExportButton({ username }: ExportButtonProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleExport = useCallback(() => {
        setStatus("loading");
        window.dispatchEvent(new Event("start-high-res-export"));

        // Wait for R3F to update the layout and render the high-res frame
        setTimeout(() => {
            const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
            if (!canvas) {
                setStatus("error");
                window.dispatchEvent(new Event("end-high-res-export"));
                setTimeout(() => setStatus("idle"), 2000);
                return;
            }

            try {
                const exportCanvas = document.createElement("canvas");
                exportCanvas.width = canvas.width;
                exportCanvas.height = canvas.height;
                const ctx = exportCanvas.getContext("2d");

                if (ctx) {
                    ctx.drawImage(canvas, 0, 0);

                    // Adding Watermark
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    ctx.font = `bold ${Math.max(20, exportCanvas.height * 0.02)}px monospace`;
                    ctx.textAlign = "right";
                    ctx.textBaseline = "bottom";
                    const padding = exportCanvas.height * 0.03;
                    ctx.fillText("Astro-Git Explorer", exportCanvas.width - padding, exportCanvas.height - padding - exportCanvas.height * 0.03);

                    ctx.fillStyle = "rgba(255, 136, 0, 0.8)";
                    ctx.font = `${Math.max(16, exportCanvas.height * 0.015)}px monospace`;
                    ctx.fillText("github.com/AstroGit", exportCanvas.width - padding, exportCanvas.height - padding);

                    // Add username if provided
                    if (username) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
                        ctx.font = `bold ${Math.max(24, exportCanvas.height * 0.025)}px monospace`;
                        ctx.textAlign = "left";
                        ctx.textBaseline = "top";
                        ctx.fillText(`@${username}'s Universe`, padding, padding);
                    }
                }

                const dataUrl = exportCanvas.toDataURL("image/png", 1.0);
                const link = document.createElement("a");
                link.download = `astrogit-${username || 'capture'}-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();

                setStatus("success");
            } catch (err) {
                console.error("Failed to export canvas:", err);
                setStatus("error");
            } finally {
                window.dispatchEvent(new Event("end-high-res-export"));
                setTimeout(() => setStatus("idle"), 2000);
            }
        }, 800); // 800ms gives React and R3F time to switch to high DPR and render a frame
    }, [username]);

    return (
        <button
            onClick={handleExport}
            disabled={status === "loading"}
            className={`backdrop-blur-md border px-4 py-2 rounded-full text-sm font-mono transition-all shadow-lg flex items-center gap-2 ${status === "success"
                ? "bg-green-500/20 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                : status === "error"
                    ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    : status === "loading"
                        ? "bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-wait"
                        : "bg-black/40 border-white/10 text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                }`}
            title="Export galaxy as PNG"
        >
            {status === "loading" ? "⏳ Processing..." : status === "success" ? "✅ Exported!" : status === "error" ? "❌ Failed" : "📸 Export"}
        </button>
    );
}
