'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { POPULAR_STOCK_SYMBOLS } from '@/lib/constants';

export default function StocksPage() {
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();

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
                {/* Search Section */}
                <div className="mb-12">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold mb-8 text-center">Search Stocks</h1>

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
                    <h2 className="text-2xl font-semibold mb-6">Popular Stocks</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {POPULAR_STOCK_SYMBOLS.map((symbol) => (
                            <button
                                key={symbol}
                                onClick={() => handleSymbolClick(symbol)}
                                className="p-4 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-center font-medium"
                            >
                                {symbol}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
