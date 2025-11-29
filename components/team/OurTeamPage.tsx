'use client';
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';


const Github = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

// Imports

import { OperativeDetailModal } from './OperativeDetailModal';
import { SQUAD_DATA, TeamMember } from '@/lib/team-data';
import { OperativeCard } from './OperativeCard';
export default function TeamPage() {
    const [selectedMember, setSelectedMember] = useState<{
        github: any,
        local: TeamMember
    } | null>(null);

    return (
        <section className="relative w-full py-24 bg-transparent overflow-hidden min-h-screen">

            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] opacity-10 dark:opacity-20"></div>
                <div className="absolute inset-0 bg-white/0 dark:bg-black/0 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-cyan-900 bg-gray-100 dark:bg-cyan-950/30 text-gray-600 dark:text-cyan-400 text-xs font-medium mb-4">
                        <Github />
                        <span>GIT_CONNECT</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                        The Squad
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                        Digital architects. Click card to access full personnel file.
                    </p>
                </div>

                {/* The List of Cards */}
                <div className="flex flex-col items-center">
                    {SQUAD_DATA.map((member, index) => (
                        <OperativeCard
                            key={member.username}
                            member={member}
                            index={index}
                            onClick={(githubData, localData) => {
                                setSelectedMember({ github: githubData, local: localData });
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Modal Popup */}
            <AnimatePresence>
                {selectedMember && (
                    <OperativeDetailModal
                        githubData={selectedMember.github}
                        localData={selectedMember.local}
                        onClose={() => setSelectedMember(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}