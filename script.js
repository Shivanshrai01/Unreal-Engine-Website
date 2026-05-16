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
