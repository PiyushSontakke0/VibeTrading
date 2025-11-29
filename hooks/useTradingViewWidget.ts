'use client';

import { useEffect, useRef, useState } from 'react';

const useTradingViewWidget = (
    scriptUrl: string,
    config: Record<string, any>,
    height = 600,
    watchKey?: string,
    priority = false
) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(priority);

    useEffect(() => {
        if (priority) return;

        const element = containerRef.current;
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setShouldLoad(true);
                observer.disconnect();
            }
        }, { rootMargin: "200px" });

        observer.observe(element);

        return () => observer.disconnect();
    }, [priority]);

    // 2. Widget Injection Logic
    useEffect(() => {
        // Only proceed if we are allowed to load
        if (!shouldLoad) return;

        const container = containerRef.current;
        if (!container) return;

        // Cleanup existing widgets to prevent duplicates/crashes
        container.innerHTML = '';

        // Create the specific container div required by TradingView
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container__widget';
        widgetContainer.style.width = '100%';
        widgetContainer.style.height = `${height}px`;
        container.appendChild(widgetContainer);

        // Create the script tag
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.type = 'text/javascript';
        script.async = true;

        // Construct the config safely
        const finalConfig = {
            width: "100%",
            height: height,
            ...config
        };

        // Use native JSON.stringify for better performance and safety
        script.innerHTML = JSON.stringify(finalConfig);

        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [scriptUrl, config, height, watchKey, shouldLoad]);

    return containerRef;
};

export default useTradingViewWidget;