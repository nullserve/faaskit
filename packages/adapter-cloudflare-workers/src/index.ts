addEventListener('fetch', (event: FetchEvent) =>
  event.respondWith(
    (async it => new Response(JSON.stringify(it)))(event.request),
  ),
)
