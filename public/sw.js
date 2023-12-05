if (!self.define) {
  let e,
    s = {};
  const n = (n, i) => (
    (n = new URL(n + ".js", i).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, c) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[a]) return;
    let t = {};
    const o = (e) => n(e, a),
      r = { module: { uri: a }, exports: t, require: o };
    s[a] = Promise.all(i.map((e) => r[e] || o(e))).then((e) => (c(...e), t));
  };
}

// Disable Workbox debugging messages
self.__WB_DISABLE_DEV_LOGS = true;

define(["./workbox-7c2a5a06"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "6c6a6bb6ba77f8655e8463d538c39849",
        },
        {
          url: "/_next/static/WYK2o12HkBMYLo1QhL4_7/_buildManifest.js",
          revision: "6e5653c3ec49870b717da3e528a015c7",
        },
        {
          url: "/_next/static/WYK2o12HkBMYLo1QhL4_7/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/110-7d5f0beaf484e05f.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/13b76428-fb119cac1c6c3c2d.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/152-7e9cc5184eb7ec10.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/160.4645357c7eb36b9b.js",
          revision: "4645357c7eb36b9b",
        },
        {
          url: "/_next/static/chunks/199-e12d88d1c04a1cce.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/278-b9b1ba2635429da5.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/367-2f21cea497d52ffd.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/396-14f74eb1ae9c8c94.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/404-3bd5c015440052ae.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/417-0c5b9267b5530f05.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/474-a37e9254c9b6d5b7.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/499.fc312fa1e8301e0c.js",
          revision: "fc312fa1e8301e0c",
        },
        {
          url: "/_next/static/chunks/503-836be69dede76ac0.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/507-5bdbd04b9c3725cd.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/545.865166402be410cf.js",
          revision: "865166402be410cf",
        },
        {
          url: "/_next/static/chunks/570-4087ceb5ea35ea99.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/602-1f6aac44c637ac07.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/610.002172b586789849.js",
          revision: "002172b586789849",
        },
        {
          url: "/_next/static/chunks/623-0c4dea793011df65.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/628-c53205386c83ec5e.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/670-2ecde6edc7a33265.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/694-2e4bd04094092a11.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/746-dec6bfa20a922688.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/749-b92f41f5e43f0b10.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/939-bdfd4a3c75510972.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/963-2ab390f3fa7f6e71.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/964-ea643536be01bc27.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/_not-found-8866326054ffe4f2.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-4e6b1646a164f412.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/answer-form/%5Bid%5D/page-4b1bbc930fc3dc07.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/answer-form/page-04d29ff6560b8a90.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/create-form/edit-form/%5Bid%5D/page-39ae5dc4992ae133.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/create-form/new-form/page-85e64b7c91290d9e.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/create-form/page-13af4eb44e94fbe4.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/results/%5Bid%5D/page-9be6ee6ecc65e5ba.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/results/%5Bid%5D/view/%5Bid%5D.js/page-b0b78c93b670074e.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/forms/results/page-c53226780fc076e2.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/layout-2322df69a360f463.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/login/page-9391894d0219046c.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/page-71ae9498c676fd35.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/app/user-management/page-ca748470a3826529.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/e37a0b60-269ef973f827543e.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/fd9d1056-cdba2ae5b36dc661.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/framework-43665103d101a22d.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/main-app-1cd97dd1e0b155ae.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/main-e94b3bbce56073d2.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/pages/_app-1119879f58cf7c39.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/pages/_error-c36d9a4cb02591e8.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-0d0987e4ee6c6665.js",
          revision: "WYK2o12HkBMYLo1QhL4_7",
        },
        {
          url: "/_next/static/css/8f777bcb3b8524df.css",
          revision: "8f777bcb3b8524df",
        },
        {
          url: "/icon-192x192.png",
          revision: "38eeab311a286be5bf39cda4e0a4a3d5",
        },
        {
          url: "/icon-256x256.png",
          revision: "19d88f594beb276245006938d22977e6",
        },
        {
          url: "/icon-384x384.png",
          revision: "3dc0fd07f96b98de48e06a5284daa0fc",
        },
        {
          url: "/icon-512x512.png",
          revision: "67877cad686b22086ece1bc543c0350e",
        },
        {
          url: "/images/fb-icon.png",
          revision: "16c62be9a2619403664a8562a19d2d34",
        },
        {
          url: "/images/filter_list.png",
          revision: "3a7ed20d60ed3ac116f37bd85d18621d",
        },
        {
          url: "/images/home-highlight.png",
          revision: "e9577cbe83548b0b83392b86f96a88b6",
        },
        {
          url: "/images/home.svg",
          revision: "06963915f734bee022b240a9011a1bdc",
        },
        {
          url: "/images/ig-icon.png",
          revision: "fbe35086b89a4eb79edc258d3b33cc6c",
        },
        {
          url: "/images/logo.png",
          revision: "086360832e127c50a6cd08256ee9f752",
        },
        {
          url: "/images/logo.svg",
          revision: "7b32d9a75935e31b424f0351ac26ced7",
        },
        {
          url: "/images/merch.png",
          revision: "7fd17e5855e58172d44d76b34e271a54",
        },
        {
          url: "/images/product.png",
          revision: "017abff624147bf445c3e700f99d54aa",
        },
        {
          url: "/images/produk.png",
          revision: "9b07c734d2c1ab4496e15f00fe1cf5b0",
        },
        {
          url: "/images/rectangle-3.png",
          revision: "1069edda207599092bd0149a8308908a",
        },
        {
          url: "/images/rectangle-4.png",
          revision: "3c8ab79d99cd28273d474ba4997b24b1",
        },
        {
          url: "/images/rectangle-5.png",
          revision: "00145cfd8af6ac604fa15eef9746c155",
        },
        {
          url: "/images/search.png",
          revision: "b69e41e5831fd0052e621152bf094d34",
        },
        {
          url: "/images/twitter-icon.png",
          revision: "6cee9d04fa1f8e06e687a2ab80552ece",
        },
        {
          url: "/images/youtube-icon.png",
          revision: "2c27ca99590deb33f999ef0edc4ea6db",
        },
        { url: "/manifest.json", revision: "d41d8cd98f00b204e9800998ecf8427e" },
        {
          url: "/manifest.webmanifest",
          revision: "409c842c6155df7cc7836fea561f31f2",
        },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "61c6b19abff40ea7acd577be818f3976" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: i,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
