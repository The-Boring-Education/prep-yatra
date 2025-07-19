#!/usr/bin/env node

/**
 * Cache Clearing Script for PrepYatra
 * Run this script to clear browser cache and force fresh deployment
 */

console.log("🧹 PrepYatra Cache Clearing Script")
console.log("=====================================")

// Instructions for users
console.log("\n📋 To fix the chunk loading issue, please:")
console.log("")
console.log(
    "1. Open your browser and go to: https://prepyatra.theboringeducation.com"
)
console.log(
    "2. Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac) to hard refresh"
)
console.log("3. Or clear your browser cache manually:")
console.log("   - Chrome: Settings > Privacy > Clear browsing data")
console.log("   - Firefox: Options > Privacy > Clear Data")
console.log("   - Safari: Preferences > Privacy > Manage Website Data")
console.log("")
console.log(
    "4. If the issue persists, try opening in an incognito/private window"
)
console.log("")
console.log(
    "🔄 The new deployment includes automatic cache busting and error recovery."
)
console.log("💡 Future deployments will automatically handle cache clearing.")

// Check if we're in a browser environment
if (typeof window !== "undefined") {
    console.log("\n🌐 Browser detected - attempting automatic cache clear...")

    if ("caches" in window) {
        caches.keys().then((names) => {
            console.log(`Found ${names.length} cached items, clearing...`)
            names.forEach((name) => {
                caches.delete(name)
                console.log(`Cleared cache: ${name}`)
            })
            console.log("✅ Cache cleared successfully!")
            console.log("🔄 Reloading page...")
            setTimeout(() => window.location.reload(), 1000)
        })
    } else {
        console.log("❌ Cache API not available in this browser")
    }
} else {
    console.log("\n📝 This script can also be run in the browser console:")
    console.log("   - Press F12 to open developer tools")
    console.log("   - Go to Console tab")
    console.log(
        '   - Paste: if("caches"in window){caches.keys().then(n=>n.forEach(c=>caches.delete(c)));location.reload()}'
    )
}

console.log("\n✅ Cache clearing instructions completed!")
