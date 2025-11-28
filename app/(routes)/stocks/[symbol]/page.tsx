// app/(routes)/stocks/[symbol]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import TradingViewWidget from "@/components/TradingViewWidget";
// import WatchlistButton from "@/components/WatchlistButton";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

function normalizeSymbol(value?: string | string[]) {
    if (!value) return "";
    const resolved = Array.isArray(value) ? value[0] : value;
    return decodeURIComponent(resolved).trim().toUpperCase();
}

const DEFAULT_SYMBOL = "AAPL";

export default function StockDetails() {
    const params = useParams();

    const resolvedSymbol = normalizeSymbol(params?.symbol as string);
    const symbol = resolvedSymbol || DEFAULT_SYMBOL;
    const usingFallback = !resolvedSymbol;

    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full p-4 md:p-6 lg:p-8">
                {usingFallback && (
                    <div className="md:col-span-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
                        No symbol detected in the URL. Showing default data for <strong>{DEFAULT_SYMBOL}</strong>. Update the URL to /stocks/TSLA (for example) to view a different ticker.
                    </div>
                )}

                {/* Left column */}
                <div className="flex flex-col gap-6">
                    <TradingViewWidget
                        key={`symbol-info-${symbol}`}
                        symbol={symbol}
                        scriptUrl={`${scriptUrl}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                        height={170}
                    />

                    <TradingViewWidget
                        key={`candle-chart-${symbol}`}
                        symbol={symbol}
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />

                    <TradingViewWidget
                        key={`baseline-chart-${symbol}`}
                        symbol={symbol}
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(symbol)}
                        className="custom-chart"
                        height={600}
                    />
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6">
                    {/* <WatchlistButton ... /> */}

                    <TradingViewWidget
                        key={`technical-analysis-${symbol}`}
                        symbol={symbol}
                        scriptUrl={`${scriptUrl}technical-analysis.js`}
                        config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                        height={400}
                    />

                    <TradingViewWidget
                        key={`company-profile-${symbol}`}
                        symbol={symbol}
                        scriptUrl={`${scriptUrl}symbol-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                        height={440}
                    />

                    <TradingViewWidget
                        key={`company-financials-${symbol}`}
                        symbol={symbol}
                        scriptUrl={`${scriptUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                        height={464}
                    />
                </div>
            </section>
        </div>
    );
}
