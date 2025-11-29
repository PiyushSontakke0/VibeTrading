'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Terminal, Zap } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TeamMember } from '@/lib/team-data';
import { CircuitConnect } from './CircuitConnect';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    member: TeamMember;
    index: number;
    onClick: (githubData: any, localData: TeamMember) => void;
}

export const OperativeCard = ({ member, index, onClick }: CardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [githubData, setGithubData] = useState<any>(null);
    const [status, setStatus] = useState<'IDLE' | 'LINKED'>('IDLE');

    const [isMounted, setIsMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        fetch(`https://api.github.com/users/${member.username}`)
            .then(res => res.json())
            .then(json => setGithubData(json))
            .catch(() => { });
    }, [member.username]);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const scale = useSpring(useTransform(scrollYProgress, [0.25, 0.35, 0.65, 0.75], [0.85, 1, 1, 0.85]), { stiffness: 80, damping: 20 });
    const opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.8], [0, 1, 1, 0]);
    const xSlide = useTransform(scrollYProgress, [0.2, 0.35], [50, 0]);
    const xSpring = useSpring(xSlide, { stiffness: 80, damping: 20 });
    const xFinal = useTransform(xSpring, (latest) => index % 2 === 0 ? latest : -latest);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (v) => {
            if (v >= 0.35 && v < 0.7) setStatus('LINKED');
            else setStatus('IDLE');
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    const chartData = [
        { subject: 'FRONT', A: member.skills.frontend, fullMark: 100 },
        { subject: 'BACK', A: member.skills.backend, fullMark: 100 },
        { subject: 'DATA', A: member.skills.database, fullMark: 100 },
        { subject: 'SEC', A: member.skills.security, fullMark: 100 },
        { subject: 'OPS', A: member.skills.devops, fullMark: 100 },
    ];

    const isEven = index % 2 === 0;

    return (
        <div className="min-h-[50vh] md:min-h-[60vh] w-full flex items-center justify-center relative perspective-1000 py-10">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 md:-translate-x-1/2 z-0" />

            <motion.div
                ref={cardRef}
                onClick={() => githubData && onClick(githubData, member)}
                style={{
                    scale,
                    opacity,
                    x: (isMounted && isDesktop) ? xFinal : 0
                }}
                className={cn(
                    "relative z-10 w-full max-w-xl mx-4 md:mx-20 transition-all duration-500 cursor-pointer group",
                    "bg-white dark:bg-[#0f1115]/90 backdrop-blur-md",
                    "border rounded-xl p-6 overflow-hidden",
                    "hover:bg-gray-50 dark:hover:bg-cyan-950/10",
                    status === 'LINKED' ? "border-gray-800 dark:border-cyan-500 shadow-xl" : "border-gray-200 dark:border-white/5",
                    isEven ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                )}
            >
                <div className="hidden md:block">
                    <CircuitConnect progress={scrollYProgress} direction={isEven ? 'right' : 'left'} />
                </div>

                {/* Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-900 dark:border-cyan-500" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-900 dark:border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-900 dark:border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-900 dark:border-cyan-500" />

                <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-gray-500 dark:text-cyan-500" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 dark:text-cyan-500/80">
                            UNIT_0{index + 1}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap size={12} className={cn(status === 'LINKED' ? "text-green-600 dark:text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-700")} />
                        <span className={cn("text-[10px] font-bold font-mono", status === 'LINKED' ? "text-gray-900 dark:text-cyan-400" : "text-gray-400 dark:text-blue-900")}>
                            {status}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={githubData?.avatar_url || `https://github.com/${member.username}.png`}
                                    alt={member.username}
                                    className="relative w-14 h-14 rounded-full border border-gray-200 dark:border-cyan-500/30 object-cover bg-gray-100 dark:bg-black"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight group-hover:text-cyan-500 transition-colors">
                                    {githubData?.name || member.username}
                                </h3>
                                <div className="text-xs text-gray-500 dark:text-cyan-600 font-mono mt-1 flex items-center gap-2">
                                    @{member.username}
                                    <span className="inline-block w-1 h-1 bg-gray-400 rounded-full" />
                                    <span className="text-gray-400 dark:text-gray-500">{member.role}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <StatBadge label="REPO" val={githubData?.public_repos || 0} />
                            <StatBadge label="GIST" val={githubData?.public_gists || 0} />
                            <StatBadge label="SUB" val={githubData?.followers || 0} />
                        </div>
                    </div>

                    <div className="relative bg-gray-50 dark:bg-blue-950/10 rounded-lg p-2 border border-gray-100 dark:border-blue-900/20 flex flex-col items-center justify-center min-h-[120px]">
                        <div className="h-24 w-full opacity-60">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                                    <PolarGrid strokeOpacity={0.2} />
                                    <PolarAngleAxis dataKey="subject" tick={false} />
                                    <Radar dataKey="A" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-[9px] font-mono text-gray-400 dark:text-cyan-800 mt-2">CLICK_TO_EXPAND</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StatBadge = ({ label, val }: { label: string, val: number }) => (
    <div className="bg-gray-50 dark:bg-blue-950/20 rounded p-2 text-center border border-gray-100 dark:border-blue-900/20">
        <div className="text-sm font-bold text-gray-900 dark:text-gray-200">{val}</div>
        <div className="text-[8px] uppercase tracking-wider text-gray-500 dark:text-cyan-700 font-bold">{label}</div>
    </div>
);