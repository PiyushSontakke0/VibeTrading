'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';
import { motion } from 'framer-motion';

// --- ENHANCED MOCK DATA (with marketCap categories) ---
const COMPANY_INFO: Record<string, { name: string; sector: string; marketCap: 'small' | 'medium' | 'large' | 'xlarge' }> = {
    AAPL: { name: 'Apple Inc.', sector: 'Tech', marketCap: 'xlarge' },
    MSFT: { name: 'Microsoft Corp.', sector: 'Tech', marketCap: 'large' },
    GOOGL: { name: 'Alphabet Inc.', sector: 'Tech', marketCap: 'large' },
    NVDA: { name: 'NVIDIA Corp.', sector: 'Tech', marketCap: 'xlarge' },
    AMZN: { name: 'Amazon.com Inc.', sector: 'Retail', marketCap: 'medium' },
    TSLA: { name: 'Tesla Inc.', sector: 'Auto', marketCap: 'medium' },
    META: { name: 'Meta Platforms Inc.', sector: 'Tech', marketCap: 'medium' },
    NFLX: { name: 'Netflix Inc.', sector: 'Media', marketCap: 'small' },
    ORCL: { name: 'Oracle Corp.', sector: 'Software', marketCap: 'small' },
    CRM: { name: 'Salesforce Inc.', sector: 'Software', marketCap: 'small' },
    ADBE: { name: 'Adobe Inc.', sector: 'Software', marketCap: 'small' },
    INTC: { name: 'Intel Corp.', sector: 'Semiconductors', marketCap: 'small' },
    AMD: { name: 'Advanced Micro Devices', sector: 'Semiconductors', marketCap: 'small' },
    PYPL: { name: 'PayPal Holdings Inc.', sector: 'Fintech', marketCap: 'small' },
    UBER: { name: 'Uber Technologies Inc.', sector: 'Ride-share', marketCap: 'small' },
    ZM: { name: 'Zoom Video Comm.', sector: 'Software', marketCap: 'small' },
    SPOT: { name: 'Spotify Tech S.A.', sector: 'Media', marketCap: 'small' },
    SQ: { name: 'Block Inc.', sector: 'Fintech', marketCap: 'small' },
    SHOP: { name: 'Shopify Inc.', sector: 'E-commerce', marketCap: 'small' },
    ROKU: { name: 'Roku Inc.', sector: 'Media', marketCap: 'small' },
    SNOW: { name: 'Snowflake Inc.', sector: 'Software', marketCap: 'small' },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

// Helper function: Generate deterministic mock price series
function makeSeries(seedStr: string, len = 30) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) % 100000;
    const rnd = (max = 1) => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return (seed / 4294967296) * max;
    };
    const start = 50 + rnd(50);
    const out: number[] = [];
    let v = start;
    for (let i = 0; i < len; i++) {
        v = v * (1 + (rnd(0.02) - 0.01));
        out.push(Number(v.toFixed(2)));
    }
    return out;
}

// Helper component: Animated sparkline SVG
function Sparkline({ data, width = 120, height = 24 }: { data: number[]; width?: number; height?: number }) {
    if (!data || data.length === 0) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const points = data.map((d, i) => {
        const x = i * step;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');
    const last = data[data.length - 1];
    const first = data[0];
    const positive = last >= first;
    const stroke = positive ? 'rgb(34 197 94)' : 'rgb(239 68 68)';

    // Calculate path length for stroke animation
    const pathLength = data.length * step;

    return (
        <motion.svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="block w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.polyline
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ strokeDashoffset: pathLength, strokeDasharray: pathLength }}
                animate={{ strokeDashoffset: 0, strokeDasharray: pathLength }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                whileHover={{ strokeWidth: 2.5 }}
            />
        </motion.svg>
    );
}

// LocalStorage cache utilities
const CACHE_KEY = 'vibe_stock_prices_cache';
const CACHE_EXPIRY_KEY = 'vibe_stock_prices_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours = 1 day

function getCachedPrices(): Record<string, { price: number; change: number; percent: number; series: number[] }> | null {
    if (typeof window === 'undefined') return null;
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        if (!cached || !expiry) return null;
        if (Date.now() > parseInt(expiry)) {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_EXPIRY_KEY);
            return null;
        }
        return JSON.parse(cached);
    } catch (err) {
        console.error('Error reading cache:', err);
        return null;
    }
}

function setCachedPrices(prices: Record<string, { price: number; change: number; percent: number; series: number[] }>) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(prices));
        localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
    } catch (err) {
        console.error('Error writing cache:', err);
    }
}

export default function StocksPage() {
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();
    const [pricesMap, setPricesMap] = useState<Record<string, { price: number; change: number; percent: number; series: number[] }>>({});

    // Fetch live data from Finnhub on component mount with caching
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        let cancelled = false;

        // Check cache first
        const cached = getCachedPrices();
        if (cached) {
            setPricesMap(cached);
            return; // Use cached data, skip API calls
        }

        if (!apiKey) return;

        const fetchForSymbol = async (sym: string) => {
            try {
                const now = Math.floor(Date.now() / 1000);
                const from = now - 60 * 60 * 24 * 30; // 30 days ago

                // Fetch current quote
                const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${apiKey}`);
                const quote = await quoteRes.json();
                const price = typeof quote.c === 'number' ? quote.c : NaN;
                const prevClose = typeof quote.pc === 'number' ? quote.pc : NaN;

                // Fetch 30-day candle data
                const candleRes = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(sym)}&resolution=D&from=${from}&to=${now}&token=${apiKey}`);
                const candle = await candleRes.json();

                let series: number[] = [];
                if (candle && candle.s === 'ok' && Array.isArray(candle.c)) {
                    series = candle.c.slice(-30); // Last 30 closing prices
                } else {
                    series = makeSeries(sym, 30); // Fallback to mock data
                }

                const change = Number((price - prevClose).toFixed(2)) || 0;
                const percent = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

                if (!cancelled) {
                    setPricesMap(prev => {
                        const updated = { ...prev, [sym]: { price, change, percent, series } };
                        // Cache after each update
                        setCachedPrices(updated);
                        return updated;
                    });
                }
            } catch (err) {
                console.error(`Error fetching ${sym}:`, err);
                // Silently fall back to mock data
            }
        };

        (async () => {
            const symbols = POPULAR_STOCK_SYMBOLS.slice(0, 20);
            for (const s of symbols) {
                // eslint-disable-next-line no-await-in-loop
                await fetchForSymbol(s);
            }
        })();

        return () => { cancelled = true };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const symbol = searchInput.trim().toUpperCase();
        if (symbol) {
            router.push(`/stocks/${symbol}`);
            setSearchInput('');
        }
    };

    const handleSymbolClick = (symbol: string) => {
        router.push(`/stocks/${symbol}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="w-full p-4 md:p-6 lg:p-8">
                <div className="mb-12">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold mb-8 text-center mt-8">Search Stocks</h1>

                        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                            <Input
                                type="text"
                                placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">Search</Button>
                        </form>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Popular Stocks at a Glance.</h2>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {POPULAR_STOCK_SYMBOLS.slice(0, 20).map((symbol) => {
                                const info = COMPANY_INFO[symbol];
                                const companyName = info ? info.name : symbol;
                                const marketCapCat = info ? info.marketCap : 'small';

                                const marketCapLabel = (() => {
                                    switch (marketCapCat) {
                                        case 'xlarge':
                                            return 'Market Cap: > $2T';
                                        case 'large':
                                            return 'Market Cap: $500B - $2T';
                                        case 'medium':
                                            return 'Market Cap: $100B - $500B';
                                        default:
                                            return 'Market Cap: < $100B';
                                    }
                                })();

                                // Use live data if available, otherwise fallback to mock series
                                const live = pricesMap[symbol];
                                const series = live?.series ?? makeSeries(symbol, 30);

                                return (
                                    <button
                                        key={symbol}
                                        onClick={() => handleSymbolClick(symbol)}
                                        className="group p-2 sm:p-3 md:p-3 lg:p-4 rounded-xl border border-border bg-card hover:shadow transition-transform transform hover:-translate-y-0.5 text-left"
                                        style={{ aspectRatio: '16 / 9' }}
                                    >
                                        <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4 h-full">
                                            <div className="flex-none">
                                                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md flex items-center justify-center text-muted-foreground border border-border bg-card/80 font-semibold text-sm md:text-lg">
                                                    {symbol.slice(0, 1)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="text-lg font-semibold truncate">{symbol}</div>
                                                        <div className="text-sm text-muted-foreground hidden md:block">{info?.sector ?? 'Market'}</div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground truncate mt-1">{companyName}</div>
                                                </div>

                                                <div className="mt-1 md:mt-2 flex items-center justify-between gap-3">
                                                    <div className="text-sm text-muted-foreground">{marketCapLabel}</div>
                                                    {live && (
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-sm font-medium text-foreground">${live.price?.toFixed(2)}</span>
                                                            <span className={`text-xs font-semibold ${live.percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {live.percent >= 0 ? `+${live.percent}%` : `${live.percent}%`}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-2 md:mt-3">
                                                    <Sparkline data={series} />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}