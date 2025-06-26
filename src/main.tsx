import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

// Register service worker for caching and offline support
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("SW registered: ", registration)
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError)
            })
    })
}

// Performance monitoring
if (import.meta.env.PROD) {
    // Report Core Web Vitals
    const reportWebVitals = (metric: {
        name: string
        value: number
        id?: string
    }) => {
        console.log(metric)
        // You can send metrics to your analytics service here
    }

    // Monitor Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            reportWebVitals({
                name: "LCP",
                value: entry.startTime,
                id: entry.entryType
            })
        }
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // Monitor First Input Delay (FID)
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            const firstInputEntry = entry as PerformanceEventTiming
            reportWebVitals({
                name: "FID",
                value:
                    firstInputEntry.processingStart - firstInputEntry.startTime,
                id: firstInputEntry.entryType
            })
        }
    }).observe({ entryTypes: ["first-input"] })

    // Monitor Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as unknown as {
                hadRecentInput: boolean
                value: number
            }
            if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value
            }
        }
        reportWebVitals({
            name: "CLS",
            value: clsValue
        })
    }).observe({ entryTypes: ["layout-shift"] })
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
