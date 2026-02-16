export function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        console.log("Preloader found, initiating fade out logic...");

        const fadeOut = () => {
            console.log("Fading out preloader...");
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1000);
        };

        // Force fade out after a short delay regardless of load state to prevent blocking
        setTimeout(fadeOut, 1500);

        window.addEventListener('load', fadeOut);
    } else {
        console.error("Preloader element not found!");
    }
}

export function initMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const overlay = document.querySelector('.menu-overlay');
    const closeBtn = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-nav a');

    console.log("Init Menu:", { toggleBtn, overlay, closeBtn });

    if (!overlay) return;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            console.log("Menu Toggle Clicked");
            overlay.classList.add('open');
            overlay.style.pointerEvents = 'auto'; // Ensure it's clickable
            overlay.style.opacity = '1';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            console.log("Menu Close Clicked");
            overlay.classList.remove('open');
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        });
    }

    // Close on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('open');
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        });
    });
}
