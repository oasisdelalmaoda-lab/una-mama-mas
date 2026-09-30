// Service worker de Una Mamá Más: solo recibe los avisos de pedidos.
// No guarda nada en caché, así que nunca sirve un index.html viejo.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { cuerpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Una Mamá Más', {
    body: d.cuerpo || '', icon: 'apple-touch-icon.png', badge: 'favicon.png',
    tag: d.tag, renotify: true, data: { url: d.url || './' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ls) => {
    for (const c of ls) if ('focus' in c) return c.focus();
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  }));
});
