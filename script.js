console.log('JS v2 loaded');
// Force refresh - updated 2025-11-06

// ===== Scroll-triggered fade-ins =====
const scrollSections = document.querySelectorAll('.scroll-animate');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
scrollSections.forEach(sec => observer.observe(sec));

// ===== Tangent line canvas with curves, mesh, glowing intersections, bouncing spots =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lines = [];
const LINE_COUNT = 50;
let mouse = { x: canvas.width/2, y: canvas.height/2 };

// Initialize lines
for(let i=0;i<LINE_COUNT;i++){
    lines.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        length: 150 + Math.random()*250,
        angle: Math.random()*Math.PI*2,
        speed: 0.0008 + Math.random()*0.001,
        width: 1 + Math.random()*2,
        hue: 140 + Math.random()*40, // mint-teal
        alpha: 0.05 + Math.random()*0.05,
        phase: Math.random()*Math.PI*2,
        spotPhase: Math.random()*Math.PI*2,
        spotSize: 2 + Math.random()*2,
        curvature: (Math.random()-0.5)*0.02
    });
}

function dist(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function animateLines(){
    ctx.fillStyle = 'rgba(245,250,245,0.05)'; 
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<lines.length;i++){
        const line = lines[i];

        line.angle += line.speed;

        const dxMouse = line.x - mouse.x;
        const dyMouse = line.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse*dxMouse + dyMouse*dyMouse);
        const repel = Math.min(50, 1000/distMouse);
        line.angle += repel*0.0003;

        const x2 = line.x + Math.cos(line.angle)*line.length;
        const y2 = line.y + Math.sin(line.angle)*line.length;

        line.phase += 0.01;
        const hue = (line.hue + 10*Math.sin(line.phase)) % 360;

        const cx = (line.x + x2)/2 + line.length * line.curvature * Math.cos(line.angle + Math.PI/2);
        const cy = (line.y + y2)/2 + line.length * line.curvature * Math.sin(line.angle + Math.PI/2);

        const dynamicWidth = line.width + Math.max(0, 3 - distMouse/200);
        const gradient = ctx.createLinearGradient(line.x,line.y,x2,y2);
        gradient.addColorStop(0, `hsla(${hue},50%,70%,${line.alpha})`);
        gradient.addColorStop(1, `hsla(${(hue+30)%360},50%,75%,${line.alpha})`);

        ctx.beginPath();
        ctx.moveTo(line.x,line.y);
        ctx.quadraticCurveTo(cx,cy,x2,y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = dynamicWidth;
        ctx.shadowColor = `hsla(${hue},60%,85%,0.3)`;
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Bouncing spot
        line.spotPhase += 0.008;
        const t = (Math.sin(line.spotPhase)+1)/2;
        const spotX = (1-t)*(1-t)*line.x + 2*(1-t)*t*cx + t*t*x2;
        const spotY = (1-t)*(1-t)*line.y + 2*(1-t)*t*cy + t*t*y2;
        const pulse = 0.6 + 0.4*Math.sin(line.spotPhase*2);
        ctx.beginPath();
        ctx.arc(spotX, spotY, line.spotSize*pulse, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(60,180,120,0.4)';
        ctx.fill();
    }

    // Mesh & glowing intersections
    for(let i=0;i<lines.length;i++){
        for(let j=i+1;j<lines.length;j++){
            const l1 = lines[i];
            const l2 = lines[j];

            const mid1X = l1.x + Math.cos(l1.angle)*l1.length/2;
            const mid1Y = l1.y + Math.sin(l1.angle)*l1.length/2;
            const mid2X = l2.x + Math.cos(l2.angle)*l2.length/2;
            const mid2Y = l2.y + Math.sin(l2.angle)*l2.length/2;

            const d = dist(mid1X,mid1Y,mid2X,mid2Y);

            if(d < 200){
                ctx.beginPath();
                ctx.moveTo(mid1X, mid1Y);
                ctx.lineTo(mid2X, mid2Y);
                const glowAlpha = 0.03 + 0.02 * Math.cos((l1.phase+l2.phase)/2);
                ctx.strokeStyle = `hsla(${(l1.hue+l2.hue)/2},50%,70%,${glowAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateLines);
}

animateLines();

// Mouse
window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Touch (for mobile)
window.addEventListener('touchmove', e => {
    // Prevent scrolling or pinch zoom while interacting
    e.preventDefault();

    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
}, { passive: false });

// Optional: also respond to taps (so mouse position updates on tap)
window.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
});

// Resize
window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== Subtle parallax for sections =====
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    sections.forEach(sec => {
        const offset = sec.offsetTop;
        const height = sec.offsetHeight;
        // Only move if in viewport
        if(scrollY + window.innerHeight > offset && scrollY < offset + height){
            const parallax = (scrollY - offset) * 0.05; // adjust 0.05 for strength
            sec.style.transform = `translateY(${parallax}px)`;
        }
    });
});
