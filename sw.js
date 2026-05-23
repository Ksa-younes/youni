self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json(); // Takes whatever JSON you send
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', {
        body: data.body,
        icon: data.icon,
        actions: data.actions, // This handles your buttons
        data: data.url // For clicks
      })
    );
  } catch (err) {
    // If not JSON, just show text fallback
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
