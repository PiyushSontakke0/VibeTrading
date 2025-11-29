'use client';
import { motion } from 'framer-motion';
import { X, Activity, GitCommit, Database, Cpu } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

import { TeamMember } from '@/lib/team-data';

interface ModalProps {
    githubData: any;
    localData: TeamMember | null;
    onClose: () => void;
}

export const OperativeDetailModal = ({ githubData, localData, onClose }: ModalProps) => {
    if (!localData) return null;

    const radarData = [
        { subject: 'Frontend', A: localData.skills.frontend, fullMark: 100 },
        { subject: 'Backend', A: localData.skills.backend, fullMark: 100 },
        { subject: 'Database', A: localData.skills.database, fullMark: 100 },
        { subject: 'Security', A: localData.skills.security, fullMark: 100 },
        { subject: 'DevOps', A: localData.skills.devops, fullMark: 100 },
    ];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/60 dark:bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0f] border border-gray-200 dark:border-cyan-500/30 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-blue-950/20">
                    <div className="flex items-center gap-3">
                        <img
                            src={githubData?.avatar_url || `https://github.com/${localData.username}.png`}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border border-cyan-500 bg-gray-200"
                        />
                        <div>
                            <h2 className="text-xl font-bold dark:text-white uppercase tracking-wider">{localData.username}</h2>
                            <p className="text-xs text-cyan-600 font-mono">{localData.role} // SYSTEM_ADMIN</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="dark:text-white" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Log Terminal */}
                    <div className="col-span-1 md:col-span-2 bg-black/5 dark:bg-black/40 rounded-lg p-4 font-mono text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5">
                        <p className="text-green-600">&gt; ESTABLISHING SECURE CONNECTION...</p>
                        <p>&gt; ACCESS GRANTED. USER: {localData.username}</p>
                        <p className="text-blue-500">&gt; BIO: {githubData?.bio || "No bio data available."}</p>
                        <p className="animate-pulse">&gt; _</p>
                    </div>

                    {/* Skill Radar */}
                    <div className="bg-white dark:bg-blue-950/10 border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold dark:text-cyan-400 self-start">
                            <Database size={16} /> SKILL_MATRIX
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid strokeOpacity={0.1} />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                                    <Radar name="Skills" dataKey="A" stroke="#06b6d4" strokeWidth={2} fill="#06b6d4" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* GitHub Stats */}
                    <div className="bg-white dark:bg-blue-950/10 border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold dark:text-cyan-400">
                            <Activity size={16} /> GITHUB_METRICS
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <StatBox label="PUBLIC REPOS" value={githubData?.public_repos || 0} icon={<Database size={14} />} />
                            <StatBox label="FOLLOWERS" value={githubData?.followers || 0} icon={<Activity size={14} />} />
                            <StatBox label="FOLLOWING" value={githubData?.following || 0} icon={<Cpu size={14} />} />
                            <StatBox label="GISTS" value={githubData?.public_gists || 0} icon={<GitCommit size={14} />} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StatBox = ({ label, value, icon }: any) => (
    <div className="bg-gray-50 dark:bg-blue-900/10 p-4 rounded-lg border border-gray-200 dark:border-white/5 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] text-gray-500 dark:text-cyan-600 font-bold tracking-wider">{label}</p>
            <div className="text-gray-400 dark:text-cyan-800">{icon}</div>
        </div>
        <p className="text-xl font-mono font-bold dark:text-white">{value}</p>
    </div>
);