'use client';

import { useEffect, useRef } from 'react';

const useTradingViewWidget = (
    scriptUrl: string,
    config: Record<string, any>,
    height = 600,
    watchKey?: string
) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Always clear previous content when watchKey changes
        container.innerHTML = '';

        // Create inner div for widget
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container__widget';
        widgetContainer.style.width = '100%';
        widgetContainer.style.height = `${height}px`;
        container.appendChild(widgetContainer);

        // Create script tag
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.type = 'text/javascript';
        script.async = true;

        // Set script inner text to config object
        script.innerHTML = `
      {
        "width": "100%",
        "height": ${height},
        ${Object.entries(config)
                .map(([key, val]) => `"${key}": ${JSON.stringify(val)}`)
                .join(',\n')}
      }
    `;

        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [scriptUrl, config, height, watchKey]);

    return containerRef;
};

export default useTradingViewWidget;