'use client';

import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import React, { memo } from 'react';
import { useTheme } from 'next-themes';

interface TradingViewWidgetProps {
    symbol: string;
    title?: string;
    scriptUrl?: string;
    config?: Record<string, unknown>;
    height?: number;
    className?: string;
}

const TradingViewWidget = ({
    symbol,
    title,
    scriptUrl,
    config,
    height = 600,
    className = '',
}: TradingViewWidgetProps) => {
    const { resolvedTheme } = useTheme();

    // Default widget config
    const defaultConfig = {
        symbol: symbol.toUpperCase(),
        interval: "D",
        timezone: "Etc/UTC",
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        colorTheme: resolvedTheme === 'dark' ? 'dark' : 'light',
        style: "1",
        allow_symbol_change: false,
        hide_side_toolbar: false,
        locale: "en",
        backgroundColor: "rgba(0, 0, 0, 0)",
    };

    // Merge user config on top
    const finalConfig = { ...defaultConfig, ...config };

    const watchKey = `${symbol}-${scriptUrl ?? "default"}-${resolvedTheme}`;

    const containerRef = useTradingViewWidget(
        scriptUrl ?? '',
        finalConfig,
        height,
        watchKey
    );

    return (
        <div className={`flex flex-col gap-3 w-full ${className}`}>
            {title && (
                <h3 className="text-lg font-medium tracking-tight text-foreground px-1">
                    {title}
                </h3>
            )}

            <div
                className="relative w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                style={{ height: `${height}px` }}
            >
                <div
                    ref={containerRef}
                    className="tradingview-widget-container h-full w-full"
                >
                    <div
                        className="tradingview-widget-container__widget h-full w-full"
                    />

                </div>
            </div>
        </div>
    );
};

export default memo(TradingViewWidget);