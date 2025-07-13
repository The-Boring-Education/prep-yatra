#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const DOMAIN =
    process.env.SITE_URL || "https://prepyatra.theboringeducation.com"
const OUTPUT_PATH = path.join(__dirname, "../public/sitemap.xml")

// Define your routes with their properties
const routes = [
    {
        path: "/",
        changefreq: "weekly",
        priority: 1.0,
        lastmod: new Date().toISOString().split("T")[0] // Today's date
    },
    {
        path: "/auth",
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString().split("T")[0]
    },
    {
        path: "/pricing",
        changefreq: "monthly",
        priority: 0.9,
        lastmod: new Date().toISOString().split("T")[0]
    }
    // Note: We exclude protected routes like /dashboard, /onboarding
    // and dynamic routes like /journey/:userId from SEO indexing
]

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map(
        (route) => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`

    // Ensure the public directory exists
    const publicDir = path.dirname(OUTPUT_PATH)
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
    }

    // Write the sitemap
    fs.writeFileSync(OUTPUT_PATH, sitemap)
    console.log(`✅ Sitemap generated successfully at ${OUTPUT_PATH}`)
    console.log(`📊 Generated ${routes.length} URLs for domain: ${DOMAIN}`)
}

// Run the generator
try {
    generateSitemap()
} catch (error) {
    console.error("❌ Error generating sitemap:", error)
    process.exit(1)
}
