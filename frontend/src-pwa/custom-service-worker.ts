/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
// if (process.env.MODE !== 'ssr' || process.env.PROD) {
//   registerRoute(
//     new NavigationRoute(
//       createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
//       { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
//     )
//   );
// }

console.log('RANDOM LOG');

self.addEventListener('push', (event) => {
  event.waitUntil(
    (() => {
      const data = event.data ? event.data.json() : {};
      console.log('Push event data:', data);
      const title = data.title || 'Notification';

      return self.registration.showNotification(title, {
        body: data.body,
      });
    })()
  );
});

// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//
//   const url = event.notification.data;
//
//   event.waitUntil(
//     clients
//       .matchAll({ type: 'window', includeUncontrolled: true })
//       .then((clientList) => {
//         const client = clientList.find((c) => c.url === url && 'focus' in c);
//         if (client) {
//           return client.focus();
//         }
//         if (clients.openWindow) {
//           return clients.openWindow(url);
//         }
//       })
//   );
// });
