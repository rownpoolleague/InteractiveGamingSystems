importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBek60G1Ns_PVhODcp02H0S2jryhdUKFuQ",
  projectId: "sscc-push",
  messagingSenderId: "954838466310",
  appId: "1:954838466310:web:d7ba03562b6c0b8db66887"
});

const messaging = firebase.messaging();

// FIXED: handles data-only payloads safely
messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || "Notification";
  const body = payload.data?.body || "";
  const icon = payload.data?.icon || "/chess/iconking.png";
  const url = payload.data?.url || "";

  const notificationOptions = {
    body: body,
    icon: icon,
    data: { url: url }
  };

  self.registration.showNotification(title, notificationOptions);
});

// Click → open URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  if (url) event.waitUntil(clients.openWindow(url));
});
