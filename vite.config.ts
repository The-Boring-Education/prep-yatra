import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    base: "/",
    server: {
        host: "::",
        port: 8080
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
        Boolean
    ),
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
                    // Vendor chunks for better caching
                    vendor: ["react", "react-dom"],
                    router: ["react-router-dom"],
                    ui: [
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-select",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-toast",
                        "@radix-ui/react-tooltip",
                        "@radix-ui/react-avatar",
                        "@radix-ui/react-slot",
                        "@radix-ui/react-label",
                        "@radix-ui/react-tabs",
                        "@radix-ui/react-accordion",
                        "@radix-ui/react-alert-dialog",
                        "@radix-ui/react-aspect-ratio",
                        "@radix-ui/react-checkbox",
                        "@radix-ui/react-collapsible",
                        "@radix-ui/react-context-menu",
                        "@radix-ui/react-hover-card",
                        "@radix-ui/react-menubar",
                        "@radix-ui/react-navigation-menu",
                        "@radix-ui/react-progress",
                        "@radix-ui/react-radio-group",
                        "@radix-ui/react-scroll-area",
                        "@radix-ui/react-separator",
                        "@radix-ui/react-slider",
                        "@radix-ui/react-switch",
                        "@radix-ui/react-toggle",
                        "@radix-ui/react-toggle-group",
                        "@radix-ui/react-popover"
                    ],
                    utils: [
                        "clsx",
                        "class-variance-authority",
                        "tailwind-merge",
                        "date-fns",
                        "lucide-react"
                    ],
                    forms: ["react-hook-form", "@hookform/resolvers", "zod"],
                    data: ["@tanstack/react-query", "@supabase/supabase-js"],
                    charts: ["recharts"],
                    datepicker: ["react-datepicker", "react-day-picker"]
                },
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId
                        ? chunkInfo.facadeModuleId.split("/").pop()
                        : "chunk"
                    return `js/[name]-[hash].js`
                },
                entryFileNames: "js/[name]-[hash].js",
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name?.split(".") || []
                    const ext = info[info.length - 1]
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return `images/[name]-[hash][extname]`
                    }
                    if (/css/i.test(ext)) {
                        return `css/[name]-[hash][extname]`
                    }
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
            "@tanstack/react-query",
            "@supabase/supabase-js"
        ]
    }
}))
