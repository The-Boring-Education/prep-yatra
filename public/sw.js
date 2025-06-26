const CACHE_NAME = "prep-yatra-v1"
const STATIC_CACHE = "prep-yatra-static-v1"
const DYNAMIC_CACHE = "prep-yatra-dynamic-v1"

// Files to cache immediately
const STATIC_FILES = [
    "/",
    "/index.html",
    "/static/js/bundle.js",
    "/static/css/main.css",
    "/manifest.json",
    "/favicon.ico"
]

// Install event - cache static files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log("Opened cache")
            return cache.addAll(STATIC_FILES)
        })
    )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName !== STATIC_CACHE &&
                        cacheName !== DYNAMIC_CACHE
                    ) {
                        console.log("Deleting old cache:", cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
    const { request } = event

    // Skip non-GET requests
    if (request.method !== "GET") {
        return
    }

    // Handle API requests differently
    if (request.url.includes("/api/")) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response before using it
                    const responseClone = response.clone()

                    // Cache successful API responses
                    if (response.status === 200) {
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, responseClone)
                        })
                    }

                    return response
                })
                .catch(() => {
                    // Return cached API response if available
                    return caches.match(request)
                })
        )
        return
    }

    // Handle static assets
    event.respondWith(
        caches.match(request).then((response) => {
            // Return cached version if available
            if (response) {
                return response
            }

            // Clone the request
            const fetchRequest = request.clone()

            return fetch(fetchRequest).then((response) => {
                // Check if we received a valid response
                if (
                    !response ||
                    response.status !== 200 ||
                    response.type !== "basic"
                ) {
                    return response
                }

                // Clone the response
                const responseToCache = response.clone()

                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, responseToCache)
                })

                return response
            })
        })
    )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
    if (event.tag === "background-sync") {
        event.waitUntil(doBackgroundSync())
    }
})

async function doBackgroundSync() {
    try {
        // Handle any pending offline actions
        console.log("Background sync triggered")
    } catch (error) {
        console.error("Background sync failed:", error)
    }
}

// Push notification handling
self.addEventListener("push", (event) => {
    const options = {
        body: event.data ? event.data.text() : "No payload",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: "explore",
                title: "View",
                icon: "/favicon.ico"
            },
            {
                action: "close",
                title: "Close",
                icon: "/favicon.ico"
            }
        ]
    }

    event.waitUntil(self.registration.showNotification("Prep Yatra", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
    event.notification.close()

    if (event.action === "explore") {
        event.waitUntil(clients.openWindow("/"))
    }
})
