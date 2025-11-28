"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "spinner" | "dots" | "orbit";
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
};

export function LoaderD({
    className,
    size = "md",
    variant = "spinner",
    text,
    fullScreen = false,
}: LoaderProps) {
    // Container Logic
    const Container = fullScreen ? FixedOverlay : "div";
    const containerProps = fullScreen
        ? { className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm" }
        : { className: cn("flex flex-col items-center justify-center gap-3", className) };

    return (
        // @ts-ignore - framer motion types can be tricky with dynamic components, this is safe
        <Container {...containerProps}>
            {variant === "spinner" && <Spinner size={size} />}
            {variant === "dots" && <Dots size={size} />}
            {variant === "orbit" && <Orbit size={size} />}

            {text && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm font-medium animate-pulse"
                >
                    {text}
                </motion.p>
            )}
        </Container>
    );
}

// --- Variants ---

function Spinner({ size }: { size: keyof typeof sizeClasses }) {
    return (
        <div className={cn("relative", sizeClasses[size])}>
            <motion.span
                className="block w-full h-full border-4 border-muted/30 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

function Dots({ size }: { size: keyof typeof sizeClasses }) {
    const dotSize = size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : "w-3 h-3";

    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={cn("bg-primary rounded-full", dotSize)}
                    animate={{
                        y: ["0%", "-50%", "0%"],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

function Orbit({ size }: { size: keyof typeof sizeClasses }) {
    return (
        <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
            {/* Center Dot */}
            <motion.div
                className="w-1/4 h-1/4 bg-primary rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Outer Ring 1 */}
            <motion.div
                className="absolute inset-0 border-2 border-primary/30 rounded-full"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: "transparent", borderLeftColor: "transparent" }}
            />
            {/* Outer Ring 2 (Counter rotate) */}
            <motion.div
                className="absolute inset-1 border-2 border-primary/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ borderBottomColor: "transparent", borderRightColor: "transparent" }}
            />
        </div>
    );
}

// --- Helper for Full Screen ---
const FixedOverlay = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={className}
    >
        {children}
    </motion.div>
);