# Scroll Effects Audit — nanotech-clone

Tarih: 2026-02-17

---

## 1. Kullanilan Kutuphane ve Bagimliliklar

| Kutuphane | Versiyon | Kullaniliyor mu? | Nerede? |
|-----------|----------|-------------------|---------|
| GSAP | 3.14.2 | EVET | Tum animasyonlarin temeli |
| GSAP ScrollTrigger | (gsap ile birlikte) | EVET | `main.js`, `projects.js`, `bento.js` |
| GSAP Draggable | (gsap ile birlikte) | EVET | `light-switch.js` |
| Lenis | 1.3.17 | HAYIR | `package.json`'da var ama hicbir yerde import edilmiyor |
| imagesloaded | 5.0.0 | HAYIR | `package.json`'da var ama hicbir yerde import edilmiyor |

> **NOT:** `lenis` ve `imagesloaded` olü bagimliliklar. Kullanilmiyor.

---

## 2. Scroll-Based Efektler Ozet Tablosu

| # | Dosya | Component | Efekt Tipi | Trigger | CSS Props | Kutuphane |
|---|-------|-----------|------------|---------|-----------|-----------|
| 1 | `src/components/projects.js` | `initProjects()` | Background crossfade | `top center` / `bottom center` | `opacity` | GSAP ScrollTrigger |
| 2 | `src/components/bento.js` | `initBentoGrid()` — Entrance | Staggered fade-in + slide-up | `top 75%` | `opacity`, `translateY` | GSAP ScrollTrigger |
| 3 | `src/components/bento.js` | `initBentoGrid()` — Parallax | Scroll-scrubbed parallax | `top bottom` / `bottom top` | `translateY` | GSAP ScrollTrigger (scrub) |
| 4 | `src/components/separator.css` | Pure CSS | CSS native parallax | Scroll pozisyonu (native) | `background-attachment: fixed` | Pure CSS |
| 5 | `style.css` + `index.html` | Z-index katman illüzyonu | Scroll reveal (mimari) | Scroll pozisyonu (native) | `position: fixed`, `background: transparent` | Pure CSS |

---

## 3. Her Efektin Detayli Analizi

---

### Efekt 1: Project Background Crossfade

**Dosya:** `src/components/projects.js:4-45`
**Mekanizma:** 4 adet `.project-title-item` elementi scroll edildiginde, karsilik gelen `.project-bg` arka plan gorselinin opacity'si 1 yapilir, digerleri 0'a duser.

```
Scroll Akisi:

  DISCOVER (index 0) → project-bg[0] opacity: 1  (Digital Art)
  LEARN    (index 1) → project-bg[1] opacity: 1  (Photography)
  Unbreak  (index 2) → project-bg[2] opacity: 1  (Tech/Cyber)
  Better Off (index 3) → project-bg[3] opacity: 1  (Architecture)
```

**ScrollTrigger Konfigurasyonu:**
```js
ScrollTrigger.create({
    trigger: item,                          // Her .project-title-item
    start: "top center",                    // Elementin ustu viewport ortasina geldiginde
    end: "bottom center",                   // Elementin alti viewport ortasindan gectiginde
    onEnter: () => setActive(index),        // Asagi scroll
    onEnterBack: () => setActive(index),    // Yukari scroll
});
```

**setActive fonksiyonu:**
```js
const setActive = (index) => {
    bgs.forEach(bg => bg.style.opacity = '0');      // Tum arkaplanlar gizle
    items.forEach(item => item.classList.remove('active')); // Tum item'lar sonik
    if (bgs[index]) bgs[index].style.opacity = '1';        // Secili arka plan goster
    if (items[index]) items[index].classList.add('active'); // Secili item parlat
};
```

**CSS Transition (style.css:109):**
```css
.project-bg {
    opacity: 0;
    transition: opacity 0.6s ease-in-out;   /* Gorseller arasi yumusak gecis */
}
```

**CSS Class Transition (style.css:215-216):**
```css
.project-title-item {
    opacity: 0.3;                            /* Varsayilan: sonik */
    transition: opacity 0.5s ease;
}
.project-title-item.active {
    opacity: 1;                              /* Aktif: parlak */
}
```

**Ek:** Mouse `mouseenter` listener da var — masaustu kullanicilari hover ile de arka plan degistirebilir.

**DIKKAT:** Fonksiyon `setTimeout(() => {...}, 300)` ile sarilanmis. DOM'un hazir olmasi icin bekleniyor ama bu fragile bir yaklasim.

---

### Efekt 2: Bento Grid Entrance Animation

**Dosya:** `src/components/bento.js:13-25`
**Mekanizma:** `.discover-section` viewport'a girdiginde, `.bento-card` kartlari sirayla asagidan yukari kayarak goruntulenir.

**ScrollTrigger Konfigurasyonu:**
```js
gsap.from(cards, {
    scrollTrigger: {
        trigger: '.discover-section',
        start: 'top 75%',                   // Section ustu viewport'un %75'ine geldiginde
        toggleActions: 'play none none reverse'
        // play:    ileri scroll → animasyonu oynat
        // none:    section'dan cikinca → bir sey yapma
        // none:    geri scroll ile tekrar girince → bir sey yapma
        // reverse: geri scroll ile cikinca → geri sar
    },
    y: 150,                                  // Baslangic: 150px asagida
    opacity: 0,                              // Baslangic: gorunmez
    duration: 1,                             // 1 saniye
    stagger: 0.15,                           // Kartlar arasi 150ms gecikme
    ease: 'power4.out',                      // Hizli baslayip yavas biten easing
    clearProps: 'all'                        // Animasyon bitince inline stil'leri temizle
});
```

**Animasyon Akisi:**
```
t=0.00s  bento-hero     →  y:150, opacity:0  →  y:0, opacity:1
t=0.15s  bento-stats    →  y:150, opacity:0  →  y:0, opacity:1
t=0.30s  bento-trending →  y:150, opacity:0  →  y:0, opacity:1
t=0.45s  bento-action   →  y:150, opacity:0  →  y:0, opacity:1
```

---

### Efekt 3: Bento Grid Parallax

**Dosya:** `src/components/bento.js:29-41`
**Mekanizma:** `.bento-grid-panel` scroll pozisyonuna bagli olarak icerikten farkli hizda hareket eder (derinlik illuzyonu).

**ScrollTrigger Konfigurasyonu:**
```js
gsap.fromTo(gridPanel,
    { y: 100 },                             // Baslangic: 100px asagida
    {
        y: -200,                             // Bitis: 200px yukarida (toplam 300px yol)
        ease: 'none',                        // Lineer — scroll ile dogrudan eslesir
        scrollTrigger: {
            trigger: '.discover-section',
            start: 'top bottom',             // Section ustu viewport altina geldiginde basla
            end: 'bottom top',               // Section alti viewport ustunden gectiginde bitir
            scrub: 1                         // 1 saniye gecikme ile scroll'a bagla
        }
    }
);
```

**Gorsel Aciklama:**
```
Scroll Pozisyonu         Grid Panel Y
─────────────────       ──────────────
Section goruntude degil  → y: +100px  (asagida, gorunmuyor)
Section tam ortada       → y: ~-50px  (ortada, icerigi gecmis)
Section geride kaldi     → y: -200px  (yukariya kaymis)
```

**scrub: 1 demek:** Scroll pozisyonunu 1 saniye gecikmeyle takip eder. Ani degil, yumusak.

---

### Efekt 4: CSS Native Parallax — Separator Section

**Dosya:** `src/components/separator.css:1-20`
**Mekanizma:** `background-attachment: fixed` ile arka plan goruntusu scroll sirasinda sabit kalir, icerik uzerinden kayar.

```css
.separator-section {
    height: 50vh;
    background-image: url('https://images.unsplash.com/photo-1518770660439-...');
    background-attachment: fixed;            /* KILIT: Arka plan sabit */
    background-position: center;
    background-size: cover;
    z-index: 15;                             /* Diger icerik katmanlarinin uzerinde */
    box-shadow: inset 0 0 100px #000;        /* Ic golge — kenarlar kararir */
}
```

**Ek Stil:**
```css
.separator-content {
    background: rgba(0, 0, 0, 0.6);         /* Yari saydam kart */
    backdrop-filter: blur(5px);              /* Bulanik cam efekti */
}
.separator-content h2 {
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.4),
                 0 0 40px rgba(0, 255, 255, 0.2);  /* Cyan neon glow */
}
```

**NOT:** `background-attachment: fixed` mobil iOS Safari'de CALISMAZ. Apple bunu devre disi birakti.

---

### Efekt 5: Z-Index Katman Illuzyonu (Mimari Pattern)

**Dosyalar:** `style.css` + `index.html`
**Mekanizma:** Bu bir tek efekt degil, TUM scroll-based efektlerin calismasi icin zorunlu olan mimari yapidir.

```
Z-INDEX KATMAN HARITASI (altan uste):

z: 1     #project-backgrounds    position: fixed   → 4 adet arka plan gorseli burada
z: 5     .hero-section           background: opak   → Arka planlari KAPATIR
z: 5     .project-list-section   background: seffaf → Arka planlari GOSTERIR
z: 5     .site-footer            background: opak   → Arka planlari KAPATIR
z: 10    #main-content           position: relative → Ana scroll container
z: 15    .separator-section      kendi arkaplan      → fixed parallax
z: 40    .dark-overlay           position: fixed    → Light switch karartma
z: 50    .light-switch-container position: absolute → Lamba + kablo
z: 100   .site-header            position: fixed    → mix-blend-mode: difference
z: 2000  .menu-overlay           position: fixed    → Tam ekran menu
z: 9999  .custom-cursor          position: fixed    → Ozel fare imleci
z: 9999  .preloader              position: fixed    → Yukleme ekrani
```

**Scroll Illuzyonu Nasil Calisir:**
```
[HERO - Opak arkaplan #0b0b0b]     ← Arka plan gorsel GORUNMEZ
         ↓ scroll
[SEPARATOR - Kendi fixed bg'si]     ← Kendi parallax efekti
         ↓ scroll
[PROJECT LIST - Seffaf arkaplan]    ← #project-backgrounds GORUNUR OLUR
  - DISCOVER (bg[0] aktif)
  - LEARN (bg[1] aktif)
  - Unbreak (bg[2] aktif)
  - Better Off (bg[3] aktif)
         ↓ scroll
[FOOTER - Opak arkaplan #0b0b0b]   ← Arka plan gorsel tekrar GORUNMEZ
```

---

## 4. Scroll-Bagli OLMAYAN Animasyonlar (Referans)

Bu animasyonlar scroll ile tetiklenMEZ ama sayfa deneyiminin parcasidir.

### 4a. Hero Entrance Timeline (hero.js)
**Tetikleyici:** Sayfa yuklendiginde (`DOMContentLoaded`)

| Siralama | Hedef | Baslangic | Bitis | Sure | Easing |
|----------|-------|-----------|-------|------|--------|
| 1 | `.site-header` | y:-50, opacity:0 | y:0, opacity:1 | 1s | `power3.out` |
| 2 (overlap -0.5s) | `.hero-title` | y:100, opacity:0 | y:0, opacity:1 | 1.5s | `power4.out` |
| 3 (overlap -1s) | `.hero-subtitle` | y:20, opacity:0 | y:0, opacity:1 | 1s | `power3.out` |
| 4 (overlap -0.5s) | `.hero-bottom-bar > div` | y:20, opacity:0 | y:0, opacity:1 | 0.8s (stagger 0.2s) | `power2.out` |

### 4b. Light Switch (light-switch.js)
**Tetikleyici:** Kullanici `.switch-handle`'i asagi surukler

- **Drag:** Y ekseni, 0-200px sinir
- **Drag sirasinda:** Kablo uzunlugu = `150 + this.y` px
- **Drag bitisinde (y > 50px ise):** `body.light-on` class toggle
- **Geri yaylanma:** `elastic.out(1, 0.3)` 0.5s
- **Flash efekti:** `backgroundColor` 0.2s yoyo
- **Ambient sallanma:** `rotation: ±2°`, surekli, `sine.inOut`, 2s dongu

### 4c. Custom Cursor (cursor.js)
**Tetikleyici:** `mousemove` event

- Fare pozisyonunu GSAP ile takip eder: `duration: 0.1`, `power2.out`
- Hover durumunda `.active` class ekler

### 4d. Preloader (index.html inline script)
**Tetikleyici:** `window.load` event + fallback `setTimeout(4000)`

- `opacity: 0` → `display: none` (1s gecikme)

---

## 5. Fixed/Sticky Elementler

| Element | Pozisyon | Z-Index | Scroll Davranisi |
|---------|----------|---------|------------------|
| `.site-header` | `position: fixed` | 100 | Sabit kalir, `mix-blend-mode: difference` ile icerige uyum saglar |
| `#project-backgrounds` | `position: fixed` | 1 | Sabit kalir, ScrollTrigger ile icindeki `.project-bg`'ler opacity degisir |
| `.custom-cursor` | `position: fixed` | 9999 | Mouse'u takip eder |
| `.dark-overlay` | `position: fixed` | 40 | Sabit, `body.light-on` ile gizlenir |
| `.preloader` | `position: fixed` | 9999 | Sayfa yuklendikten sonra kaldirililr |
| `.menu-overlay` | `position: fixed` | 2000 | Click ile acilir/kapanir |

**`position: sticky` → KULLANILMIYOR**

---

## 6. Intersection Observer

**Dogrudan kullanim: YOK**

GSAP ScrollTrigger dahili olarak Intersection Observer API'sini kullanir, ama projede dogrudan `new IntersectionObserver(...)` cagrisi yoktur.

---

## 7. Smooth Scroll

| Yontem | Durum |
|--------|-------|
| `scroll-behavior: smooth` CSS | YOK |
| Lenis kutuphanesi | Yuklu ama KULLANILMIYOR (olu bagimlilik) |
| Custom smooth scroll | YOK |
| GSAP ScrollSmoother | YOK |

**Sonuc:** Sayfa varsayilan tarayici scroll davranisini kullanir.

---

## 8. Tespit Edilen Sorunlar ve Notlar

### Olu Bagimliliklar
- `lenis@1.3.17` — `package.json`'da var, hicbir yerde import edilmiyor
- `imagesloaded@5.0.0` — `package.json`'da var, hicbir yerde import edilmiyor

### Duplike Plugin Kaydi
- `ScrollTrigger` hem `main.js:11`'de hem `bento.js:4`'te `registerPlugin` ediliyor. Zararli degil ama gereksiz.

### Fragile Zamanlama
- `projects.js:5` — `setTimeout(() => {...}, 300)` ile DOM hazirligini bekliyor. Daha saglam: `imagesLoaded` veya `ScrollTrigger.refresh()` kullanilabilir.

### Mobil Uyumluluk
- `separator.css:8` — `background-attachment: fixed` iOS Safari'de calismaz. Mobil icin fallback gerekir.

### Eksik onLeave Callback
- `projects.js:35` — Yorum satiri: `// optional: onLeave: () => hide(index)`. Son projeden sonra scroll devam ederse, son arka plan gorunur kalir. Kasitli olabilir.
