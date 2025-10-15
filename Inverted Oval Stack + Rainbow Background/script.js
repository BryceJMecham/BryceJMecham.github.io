const circle = document.querySelector('.circle');
const scale = 0.5; // movement scale (smaller = less movement)
const invert = 1; // invert direction
const numOvals = 16;  // number of ovals in the stack
const ovals = [];

// Create ovals dynamically
for (let i = 0; i < numOvals; i++) {
    const oval = document.createElement('div');
    oval.classList.add('oval');
    if (i == 0){
        oval.style.zIndex = 10;
    }
    oval.style.opacity = 1 - i * (1 / numOvals); // progressively fade
    oval.style.transform = 'translate(-50%, -50%) scale(' + (1 - i * (1 / numOvals)) + ')';
    document.body.appendChild(oval);
    ovals.push({ el: oval, targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
}

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animate() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < ovals.length; i++) {
        const oval = ovals[i];
        const delayFactor = (i + 1) * 0.04; // slight delay between ovals
        const targetX = (centerX - mouseX) * scale * invert * (1 - i * (1 / numOvals));
        const targetY = (centerY - mouseY) * scale * invert * (1 - i * (1 / numOvals));

        // interpolate smoothly toward the target (LERP)
        oval.currentX += (targetX - oval.currentX) * (0.08 - delayFactor * (1 / numOvals));
        oval.currentY += (targetY - oval.currentY) * (0.08 - delayFactor * (1 / numOvals)); 
        //Each frame, we move it a small fraction (8%) toward the target — this creates a smooth easing effect

        oval.el.style.transform =
            `translate(calc(-50% + ${oval.currentX}px), calc(-50% + ${oval.currentY}px)) scale(${1 - i * 0.1})`;
    }

    requestAnimationFrame(animate); //ensures it updates smoothly with the screen refresh rate
}

animate(); // start animation loop