// Firebase Messaging Service Worker for background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCC6Y8BUIW4r5S5KDyVOar46LzWmvJ18G8",
  authDomain: "http://nextgen-cinema2.firebaseapp.com",
  projectId: "nextgen-cinema2",
  storageBucket: "http://nextgen-cinema2.firebasestorage.app",
  messagingSenderId: "815514025460",
  appId: "1:815514025460:web:62f51737fe564b63eecda1"
};

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, image } = payload.notification || {};
  const notifTitle = title || 'RS ANIME';
  const brandIcon = 'https://i.ibb.co.com/gLc93Bc3/android-chrome-512x512.png';
  const notifOptions = {
    body: body || '',
    icon: icon || brandIcon,
    image: image || undefined,
    badge: brandIcon,
    vibrate: [200, 100, 200],
    data: payload.data || {},
    tag: `rsanime-bg-${Date.now()}`,
  };
  self.registration.showNotification(notifTitle, notifOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rawUrl = event.notification.data?.url || '/';
  const url = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : `${self.location.origin}${rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          if ('navigate' in client) return client.navigate(url);
          return client;
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
