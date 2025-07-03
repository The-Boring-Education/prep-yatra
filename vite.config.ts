import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig(({ mode }) => ({
    base: "/",
    server: {
        host: "::",
        port: 8080
    },
    plugins: [
        react(),
        mode === "development" && componentTagger(),
        VitePWA({
            registerType: "autoUpdate",
            srcDir: "src",
            filename: "sw.js",
            manifest: false, // we're using your existing public/manifest.json
            includeAssets: [
                "favicon.ico",
                "android-chrome-192x192.png",
                "android-chrome-512x512.png",
                "screenshot-wide.png",
                "screenshot-narrow.png"
            ],
            devOptions: {
                enabled: mode === "development"
            }
        })
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    build: {
        target: "es2015",
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: mode === "production",
                drop_debugger: mode === "production"
            }
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    router: ["react-router-dom"],
                    ui: [/* your radix ui chunks */],
                    utils: [/* your utility chunks */],
                    forms: ["react-hook-form", "@hookform/resolvers", "zod"],
                    data: ["@tanstack/react-query"],
                    charts: ["recharts"],
                    datepicker: ["react-datepicker", "react-day-picker"]
                },
                chunkFileNames: `js/[name]-[hash].js`,
                entryFileNames: `js/[name]-[hash].js`,
                assetFileNames: ({ name }) => {
                    const ext = name?.split(".").pop()
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || ""))
                        return `images/[name]-[hash][extname]`
                    if (/css/i.test(ext || ""))
                        return `css/[name]-[hash][extname]`
                    return `assets/[name]-[hash][extname]`
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: mode === "development"
    },
    optimizeDeps: {
        include: [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-query"
        ]
    }
}))
