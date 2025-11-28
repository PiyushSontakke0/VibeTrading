'use client';

import useTradingViewWidget from '@/hooks/useTradingViewWidget';
import React, { memo } from 'react';

interface TradingViewWidgetProps {
    symbol: string;                     // <--- REQUIRED
    title?: string;
    scriptUrl?: string;
    config?: Record<string, unknown>;   // Optional override
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

    // Default widget config
    const defaultConfig = {
        symbol: symbol.toUpperCase(),
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        allow_symbol_change: false,
        hide_side_toolbar: false,
        locale: "en",
    };

    // Merge user config on top
    const finalConfig = { ...defaultConfig, ...config };

    const watchKey = `${symbol}-${scriptUrl ?? "default"}`;

    const containerRef = useTradingViewWidget(
        scriptUrl ?? '',
        finalConfig,
        height,
        watchKey
    );

    return (
        <div className="w-full">
            {title && (
                <h3 className="font-semibold text-2xl text-gray-100 mb-5">
                    {title}
                </h3>
            )}

            <div
                className={`tradingview-widget-container ${className}`}
                ref={containerRef}
                style={{ height: `${height}px`, width: '100%' }}
            >
                <div
                    className="tradingview-widget-container__widget"
                    style={{ height, width: '100%' }}
                />
            </div>
        </div>
    );
};

export default memo(TradingViewWidget);
