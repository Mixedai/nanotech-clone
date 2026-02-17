
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export function initLightSwitch() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // 1. HTML Yapısını Oluştur (Lamba ve Kablo)
    const switchHTML = `
        <div class="light-switch-container">
            <div class="lamp-base">
                <div class="lamp-bulb"></div>
            </div>
            <div class="switch-cord">
                <div class="switch-handle"></div>
            </div>
        </div>
        <div class="dark-overlay"></div>
    `;

    // Hero Section'ın başına ekle (z-index yönetimi için önemli)
    heroSection.insertAdjacentHTML('afterbegin', switchHTML);

    const cord = document.querySelector('.switch-cord');
    const handle = document.querySelector('.switch-handle');
    let isLightOn = false;

    // Işık Açma/Kapama Fonksiyonu
    function toggleLight() {
        isLightOn = !isLightOn;
        document.body.classList.toggle('light-on');

        // Ses efekti eklenebilir (Click sound)
        // const audio = new Audio('/click.mp3'); audio.play();

        // Görsel Geri Bildirim (Flash Efekti)
        gsap.to('.hero-section', {
            backgroundColor: isLightOn ? '#1a1a1a' : '#0b0b0b', // Hafif aydınlanma
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
    }

    // Draggable Kurulumu
    Draggable.create(handle, {
        type: "y", // Sadece dikey hareket
        bounds: { top: 0, height: 200 }, // Sınırlar
        trigger: handle,
        onDrag: function () {
            // Kablo uzasın (Basitçe scaleY veya height ile)
            // Bu örnekte handle'ın y pozisyonuna göre kabloyu uzatıyoruz gibi görünecek görsel bir hile yapabiliriz
            // Ama Draggable handle'ı hareket ettiriyor, kablo boyunu ona göre güncelleyelim
            gsap.set(cord, { height: 150 + this.y });
        },
        onDragEnd: function () {
            // Yeterince çekildi mi? (> 50px)
            if (this.y > 50) {
                toggleLight();
            }

            // Geri Yaylanma (Spring Back)
            gsap.to(handle, { y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            gsap.to(cord, { height: 150, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        }
    });

    // Başlangıçta da biraz sallansın (Rüzgar efekti gibi doğal durması için)
    gsap.to('.light-switch-container', {
        rotation: 2,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        transformOrigin: "top center"
    });
}
