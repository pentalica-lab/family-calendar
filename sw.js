// Service Worker for the family calendar PWA: Web Push display only.
self.addEventListener("push", (event) => {
  let data = { title: "ファミリーカレンダー", body: "", url: "./" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch (e) {
    try { data.body = event.data ? event.data.text() : ""; } catch (e2) { /* keep defaults */ }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url || "./" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    (async () => {
      const all = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of all) {
        if (c.url.startsWith(self.registration.scope)) {
          await c.focus();
          return;
        }
      }
      await clients.openWindow(target);
    })()
  );
});
