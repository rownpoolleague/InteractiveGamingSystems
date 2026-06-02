importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBek60G1Ns_PVhODcp02H0S2jryhdUKFuQ",
  projectId: "sscc-push",
  messagingSenderId: "954838466310",
  appId: "1:954838466310:web:d7ba03562b6c0b8db66887"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/chess/iconking.png',
    data: { url: payload.data?.url || "" }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  if (url) event.waitUntil(clients.openWindow(url));
});
