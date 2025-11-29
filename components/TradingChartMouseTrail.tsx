'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Wand2 } from 'lucide-react';

interface Point {
    x: number;
    y: number;
    timestamp: number;
    color: string;
}

const TradingChartMouseTrail = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);
    const lastColorRef = useRef<string>('#22c55e');
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isEnabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const currentY = e.clientY;

            const lastPoint = pointsRef.current.length > 0
                ? pointsRef.current[pointsRef.current.length - 1]
                : { y: currentY, color: lastColorRef.current };

            let currentColor = lastColorRef.current;
            const threshold = 3;

            if (currentY < lastPoint.y - threshold) {
                currentColor = '#00ff41'; // Green
                lastColorRef.current = currentColor;
            } else if (currentY > lastPoint.y + threshold) {
                currentColor = '#ff3131'; // Red
                lastColorRef.current = currentColor;
            }

            pointsRef.current.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: now,
                color: currentColor
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas) return;

            const now = Date.now();
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const TRAIL_LIFETIME = 100;
            pointsRef.current = pointsRef.current.filter(p => now - p.timestamp < TRAIL_LIFETIME);

            if (pointsRef.current.length < 2) {
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = 4;

            for (let i = 1; i < pointsRef.current.length; i++) {
                const prev = pointsRef.current[i - 1];
                const curr = pointsRef.current[i];

                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(curr.x, curr.y);

                ctx.strokeStyle = curr.color;
                ctx.shadowColor = curr.color;

                const age = now - curr.timestamp;
                const opacity = 1 - (age / TRAIL_LIFETIME);
                ctx.globalAlpha = Math.max(0, opacity);

                ctx.stroke();
            }

            ctx.globalAlpha = 1;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            // Reset points when unmounting/disabling so lines don't "jump" when re-enabling
            pointsRef.current = [];
        };
    }, [isEnabled]); // Re-run effect when isEnabled changes

    return (
        <>
            {isEnabled && (
                <canvas
                    ref={canvasRef}
                    className="pointer-events-none fixed inset-0 z-[9999]"
                />
            )}

            {/* Toggle Button */}

            <button
                onClick={() => setIsEnabled(!isEnabled)}
                className={`fixed bottom-5 right-5 z-[10000] p-3 rounded-full shadow-lg border transition-all duration-300 group ${isEnabled
                    ? 'bg-card text-primary border-primary/20 hover:border-primary'
                    : 'bg-muted text-muted-foreground border-transparent opacity-50 hover:opacity-100'
                    }`}
                title={isEnabled ? "Disable FX" : "Enable FX"}
            >
                <Wand2 className={`w-5 h-5 ${isEnabled ? 'animate-pulse' : ''}`} />
            </button>
        </>
    );
};

export default TradingChartMouseTrail;