const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

           
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                
                if (event.request.url.startsWith('http')) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json(); 
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', {
        body: data.body,
        icon: data.icon,
        actions: data.actions, 
        data: data.url 
      })
    );
  } catch (err) {
    
    event.waitUntil(
      self.registration.showNotification('Notification', {
        body: event.data.text()
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
