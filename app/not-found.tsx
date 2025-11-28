"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden font-sans">

            {/* 1. Technical Grid Background (TradingView style) */}
            <div
                className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            <div className="z-10 flex flex-col items-center w-full max-w-2xl px-4">

                {/* 2. The Chart Container */}
                <div className="relative w-full h-64 mb-8 bg-card/50 border rounded-xl backdrop-blur-sm shadow-sm overflow-hidden">

                    {/* Header of the fake terminal */}
                    <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs font-mono text-muted-foreground font-bold">VIBE-USD • 404 Not Found</span>
                        </div>
                        <div className="text-xs font-mono text-red-500">-100.00% ▼</div>
                    </div>

                    {/* The Animated Graph */}
                    <svg className="w-full h-full p-4" viewBox="0 0 400 200" preserveAspectRatio="none">

                        {/* Gradient Definitions */}
                        <defs>
                            <linearGradient id="crashGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines (Horizontal) */}
                        <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
                        <line x1="0" y1="150" x2="400" y2="150" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />

                        {/* Stable Line (The "Before" part) */}
                        <motion.path
                            d="M 0 100 Q 50 80, 100 100 T 200 90"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />

                        {/* The Crash Line (The "After" part) */}
                        <motion.path
                            d="M 200 90 L 250 180 L 400 190" // The sharp drop
                            fill="none"
                            stroke="#ef4444" // Red
                            strokeWidth="3"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.8, type: "spring", bounce: 0 }}
                        />

                        {/* The Area Fill (Red Flash) */}
                        <motion.path
                            d="M 200 90 L 250 180 L 400 190 L 400 200 L 200 200 Z"
                            fill="url(#crashGradient)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.6, duration: 0.5 }}
                        />

                        {/* The "Current Price" Pulse Dot */}
                        <motion.circle
                            cx="250"
                            cy="180"
                            r="4"
                            fill="#ef4444"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }} // Flash effect
                            transition={{ delay: 1.8, duration: 1, repeat: Infinity }}
                        />
                    </svg>

                    {/* Error Tooltip Overlay */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.2 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-popover/90 backdrop-blur text-popover-foreground border shadow-lg rounded-lg p-3 text-center"
                    >
                        <div className="flex items-center gap-2 justify-center text-red-500 font-bold mb-1">
                            <AlertCircle className="w-5 h-5" />
                            <span>CRASH DETECTED</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Error Code: 404</p>
                    </motion.div>
                </div>

                {/* 3. Text Content */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">
                        Whoops! Market Crash.
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                        The page you are looking for has been delisted or liquidated.
                        Let's get you back to a stable asset.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="h-12 px-8">
                            <Link href="/dashboard">
                                <Home className="w-4 h-4 mr-2" />
                                Return to Dashboard
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12">
                            <Link href="#" onClick={() => window.history.back()}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}