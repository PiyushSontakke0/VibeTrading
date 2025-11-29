'use client';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CircuitConnect = ({ progress, direction = 'left' }: { progress: MotionValue<number>, direction?: 'left' | 'right' }) => {

    const trace1 = useTransform(progress, [0.1, 0.3], [0, 1]);
    const trace2 = useTransform(progress, [0.15, 0.35], [0, 1]);
    const trace3 = useTransform(progress, [0.2, 0.4], [0, 1]);
    const glowOpacity = useTransform(progress, [0.3, 0.45, 0.6, 0.7], [0, 1, 1, 0]);

    const isLeft = direction === 'left';

    return (
        <div className={cn(
            "absolute top-0 bottom-0 w-[15vw] flex items-center justify-center pointer-events-none",
            isLeft ? "right-full -mr-px" : "left-full -ml-px"
        )}>
            <svg
                width="100%"
                height="120px"
                viewBox="0 0 100 100"
                fill="none"
                preserveAspectRatio="none"
                className={cn("overflow-visible", isLeft ? "" : "scale-x-[-1]")}
            >
                <defs>
                    <filter id="glow-trace" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Passive Traces */}
                <path d="M 100 20 L 70 20 L 60 10 L 0 10" className="stroke-gray-200 dark:stroke-blue-900/30 stroke-1" vectorEffect="non-scaling-stroke" />
                <path d="M 100 50 L 30 50 L 20 50 L 0 50" className="stroke-gray-200 dark:stroke-blue-900/30 stroke-1" vectorEffect="non-scaling-stroke" />
                <path d="M 100 80 L 50 80 L 40 90 L 0 90" className="stroke-gray-200 dark:stroke-blue-900/30 stroke-1" vectorEffect="non-scaling-stroke" />

                {/* Active Traces */}
                <motion.path
                    d="M 100 20 L 70 20 L 60 10 L 0 10"
                    className="stroke-gray-800 dark:stroke-cyan-400 stroke-[2px]"
                    fill="none"
                    style={{ pathLength: trace1, opacity: glowOpacity }}
                    vectorEffect="non-scaling-stroke"
                />
                <motion.path
                    d="M 100 50 L 30 50 L 20 50 L 0 50"
                    className="stroke-gray-800 dark:stroke-cyan-400 stroke-[2px]"
                    fill="none"
                    style={{ pathLength: trace2, opacity: glowOpacity }}
                    vectorEffect="non-scaling-stroke"
                />
                <motion.path
                    d="M 100 80 L 50 80 L 40 90 L 0 90"
                    className="stroke-gray-800 dark:stroke-cyan-400 stroke-[2px]"
                    fill="none"
                    style={{ pathLength: trace3, opacity: glowOpacity }}
                    vectorEffect="non-scaling-stroke"
                />

                <circle cx="0" cy="10" r="2" className="fill-gray-400 dark:fill-blue-800" />
                <circle cx="0" cy="50" r="2" className="fill-gray-400 dark:fill-blue-800" />
                <circle cx="0" cy="90" r="2" className="fill-gray-400 dark:fill-blue-800" />
            </svg>
        </div>
    );
};