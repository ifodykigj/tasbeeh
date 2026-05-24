const CACHE_NAME = 'tasbeeh-v1';
// قائمة الملفات اللي التطبيق هيحفظها جوه الموبايل عشان تشتغل أوفلاين
const ASSETS = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Tajawal:wght@400;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
  'https://cdn-icons-png.flaticon.com/512/2972/2972531.png'
];

// 1. تثبيت التطبيق وحفظ الملفات في الذاكرة (Cache)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('جاري حفظ ملفات التطبيق أوفلاين... 💾');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. تشغيل الموقع من الذاكرة مباشرة لو مفيش إنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // لو الملف موجود في الذاكرة هاته، لو مش موجود اطلبه من النت
      return cachedResponse || fetch(e.request);
    })
  );
});
