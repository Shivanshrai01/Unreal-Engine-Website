gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("motion-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

const frameCount = 240;
const currentFrame = index => (
    `frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const frames = {
    frame: 0
};

let loadedCount = 0;

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
    img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) {
            render();
        }
    }
}

function render() {
    const img = images[frames.frame];
    if (img && img.complete && img.naturalWidth !== 0) {
        // Cover aspect ratio
        const hRatio = canvas.width / img.naturalWidth;
        const vRatio = canvas.height / img.naturalHeight;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
        const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight,
                          centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio);
    }
}

gsap.to(frames, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".content-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5 // Smooth scrubbing
    },
    onUpdate: render
});

// Fade in textual steps
const steps = document.querySelectorAll(".step");
steps.forEach(step => {
    ScrollTrigger.create({
        trigger: step,
        start: "top center",
        end: "bottom center",
        toggleClass: "active"
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Lenis Smooth Scroll Init
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Dynamic AOS attributes
document.querySelectorAll('.text-center.mb-20, .text-center.mb-16').forEach(el => {
    el.setAttribute('data-aos', 'fade-up');
    el.setAttribute('data-aos-duration', '1000');
});

document.querySelectorAll('.glass').forEach((el, index) => {
    el.setAttribute('data-aos', 'fade-up');
    el.setAttribute('data-aos-duration', '800');
    el.setAttribute('data-aos-delay', String((index % 3) * 100));
});

// Initialize AOS
AOS.init({
    once: true,
    offset: 50,
});

// Custom Cursor GSAP Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing) {
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        let dotX = mouseX;
        let dotY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            gsap.set(cursorDot, { x: dotX, y: dotY });
            gsap.set(cursorRing, { x: ringX, y: ringY });
        });

        const hoverElements = document.querySelectorAll('a, button, .cursor-pointer');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
        });
    }
}
