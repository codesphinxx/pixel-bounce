'use strict';

const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/favicon.ico',
    '/manifest.json',
    '/css/bootstrap.min.css',
    '/assets/audio/sfx_click.m4a',
    '/assets/audio/sfx_die.m4a',
    '/assets/audio/sfx_move.m4a',
    '/assets/audio/sfx_point.m4a',
    '/assets/audio/sfx_swooshing.m4a',
    '/assets/bitmap/symtext_0.png',
    '/assets/bitmap/symtext.xml',
    '/fonts/symtext.eot',
    '/fonts/symtext.otf',
    '/fonts/symtext.svg',
    '/js/game.bundle.js',
    '/lib/bootstrap.min.js',
    '/lib/extensions.js',
    '/lib/jquery.js',
    '/lib/phaser.min.js',
    '/lib/popper.min.js',
    '/assets/data/physicsData.json',
    '/assets/img/bg.png',
    '/assets/img/bitme.png',
    '/assets/img/bitmephysics.png',
    '/assets/img/ceiling.png',
    '/assets/img/floor.png',
    '/assets/img/leftspike.png',
    '/assets/img/particle.png',
    '/assets/img/restart.png',
    '/assets/img/rightspike.png',
    '/assets/img/score_banner.png',
    '/assets/img/share.png',
    '/assets/img/shuriken.png',
    '/assets/img/soundoff.png',
    '/assets/img/soundon.png',
    '/assets/img/splash.png',
    '/assets/img/title.png',
    '/assets/img/twitter.png',
    '/icons/icon-32.png',
    '/icons/icon-48.png',
    '/icons/icon-72.png',
    '/icons/icon-96.png',
    '/icons/icon-144.png',
    '/icons/icon-192.png',
    '/icons/icon-256.png'
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) 
                {
                    return caches.delete(key);
                }
            }));
        })
    );

  self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(
    fetch(evt.request)
    .then((res) => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(evt.request.url, res.clone());
            return res;
        })
    })
    .catch(() => {
        return caches.match(evt.request).then((response) => {
            return response;
        })
        .catch(() => {
            return caches.match('offline.html');
        });
    })
  );
});