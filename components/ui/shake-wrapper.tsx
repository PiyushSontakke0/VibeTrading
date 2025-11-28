"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShakeWrapperProps {
    children: React.ReactNode;
    isError?: boolean;
    className?: string;
}

export function ShakeWrapper({ children, isError = false, className }: ShakeWrapperProps) {
    return (
        <motion.div
            className={cn("w-full", className)}
            animate={isError ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}