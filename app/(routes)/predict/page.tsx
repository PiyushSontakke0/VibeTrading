'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Prediction {
    symbol: string;
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    timeframe: string;
    recommendation: 'Buy' | 'Sell' | 'Hold';
}

export default function PredictPage() {
    const [searchInput, setSearchInput] = useState('');
    const [predictions] = useState<Prediction[]>([
        {
            symbol: 'AAPL',
            currentPrice: 189.95,
            predictedPrice: 205.50,
            confidence: 85,
            timeframe: '30 days',
            recommendation: 'Buy',
        },
        {
            symbol: 'GOOGL',
            currentPrice: 140.50,
            predictedPrice: 138.25,
            confidence: 72,
            timeframe: '30 days',
            recommendation: 'Sell',
        },
        {
            symbol: 'MSFT',
            currentPrice: 422.75,
            predictedPrice: 430.00,
            confidence: 68,
            timeframe: '30 days',
            recommendation: 'Hold',
        },
    ]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement prediction search
        console.log('Searching for predictions:', searchInput);
    };

    const getRecommendationColor = (recommendation: string) => {
        switch (recommendation) {
            case 'Buy':
                return 'text-green-500 bg-green-500/10';
            case 'Sell':
                return 'text-red-500 bg-red-500/10';
            case 'Hold':
                return 'text-yellow-500 bg-yellow-500/10';
            default:
                return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <section className="w-full p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Stock Price Predictions</h1>
                    <p className="text-muted-foreground">AI-powered market predictions based on historical data and trends</p>
                </div>

                {/* Search Section */}
                <div className="mb-8 max-w-2xl">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter stock symbol to get predictions (e.g., TSLA)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">Predict</Button>
                    </form>
                </div>

                {/* Predictions Grid */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Latest Predictions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {predictions.map((pred) => (
                            <Card key={pred.symbol} className="border border-border">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{pred.symbol}</CardTitle>
                                            <CardDescription>Prediction for {pred.timeframe}</CardDescription>
                                        </div>
                                        <span
                                            className={`text-sm font-semibold px-3 py-1 rounded ${getRecommendationColor(
                                                pred.recommendation
                                            )}`}
                                        >
                                            {pred.recommendation}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                                            <p className="text-lg font-semibold">${pred.currentPrice.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                                            <p className="text-lg font-semibold text-green-500">
                                                ${pred.predictedPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Prediction Confidence</p>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all"
                                                style={{ width: `${pred.confidence}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm font-medium mt-1">{pred.confidence}%</p>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-xs text-muted-foreground">
                                            Potential upside: {(((pred.predictedPrice - pred.currentPrice) / pred.currentPrice) * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-12 max-w-4xl">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle>How Predictions Work</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Our AI-powered prediction system analyzes historical price data, trading volumes, market trends,
                                and technical indicators to generate price forecasts.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Machine Learning</h4>
                                    <p className="text-sm text-muted-foreground">Advanced algorithms trained on years of market data</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Real-time Data</h4>
                                    <p className="text-sm text-muted-foreground">Continuously updated with latest market information</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Confidence Metrics</h4>
                                    <p className="text-sm text-muted-foreground">Transparent confidence scores for each prediction</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
