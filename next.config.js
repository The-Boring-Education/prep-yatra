/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    env: {
        NEXT_PUBLIC_TBE_WEBAPP_API_URL:
            process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL || "",
        NEXT_PUBLIC_ONBOARDING_APP_URL:
            process.env.NEXT_PUBLIC_ONBOARDING_APP_URL || "",
        NEXT_PUBLIC_GOOGLE_CLIENT_ID:
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Handle Canvas for client-side (if using any Canvas libraries)
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                canvas: false
            }
        }

        return config
    },
    experimental: {
        // Remove optimizeCss as it's causing issues with static export
    },
    compiler: {
        // Remove console logs in production
        removeConsole: process.env.NODE_ENV === "production"
    }
}

module.exports = nextConfig
