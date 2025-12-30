import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Habit Tracker',
        short_name: 'Habit',
        description: 'A simple and offline-capable habit tracking application.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
