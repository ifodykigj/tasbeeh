const CACHE_NAME = 'tasbeeh-quran-v2'; // غير الرقم ده (مثلاً لـ v3 أو v4) كل ما ترفع تعديل جديد عشان المتصفح يعرف فوراً
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// تفعيل وتثبيت الملفات الأساسية للتطبيق
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// تنظيف الكاش القديم عند التحديث
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== 'quran-audio-cache') {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية جلب البيانات (أوفلاين أولاً للملفات والصوت)
self.addEventListener('fetch', (e) => {
  // تخطي طلبات الفايربيز عشان تشتغل لايف دائماً عند وجود إنترنت
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('google.com')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});

// الاستماع لأمر التحديث الفوري المكتوب في الـ index.html
self.addEventListener('message', (e) => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
