/* Canvas Animation - Fluid Mesh Gradient */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Blob {
    constructor() {
        this.reset();
        // Randomize start position
        this.x = Math.random() * width;
        this.y = Math.random() * height;
    }

    reset() {
        this.radius = Math.random() * 200 + 150; // Huge blobs
        // Premium Colors: Softened Gold, Walnut, Tan
        const colors = [
            'rgba(179, 139, 71, 0.4)',  // Antique Gold (Low Opacity)
            'rgba(139, 94, 60, 0.3)',   // Wood Brown (Very Low)
            'rgba(222, 184, 135, 0.4)', // Burlywood/Tan
            'rgba(230, 204, 178, 0.5)'  // Soft Beige
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.vx = (Math.random() - 0.5) * 1.5; // Slow movement
        this.vy = (Math.random() - 0.5) * 1.5;
        
        // Random drift range
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges (with buffer to keep screen full)
        if (this.x < -100 || this.x > width + 100) this.vx *= -1;
        if (this.y < -100 || this.y > height + 100) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let blobs = [];

function initBlobs() {
    blobs = [];
    const numBlobs = 10; // Few large blobs
    for(let i = 0; i < numBlobs; i++) {
        blobs.push(new Blob());
    }
}

function animate() {
    // We don't clearRect completely to allow trails? 
    // No, for mesh gradient we want movement.
    ctx.clearRect(0, 0, width, height);

    // Draw white base
    ctx.fillStyle = '#fbf9f4';
    ctx.fillRect(0,0,width,height);
    
    blobs.forEach(b => {
        b.update();
        b.draw();
    });
    
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    resize();
    initBlobs();
});

resize();
initBlobs();
animate();


/* Interactions Logic - Preserved */

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-links li');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(li => {
        li.classList.remove('active');
        if (li.querySelector('a').getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});

// Scroll Reveal
const revealElements = document.querySelectorAll('.scroll-reveal');
const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('visible');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Footer Year
document.getElementById('year').textContent = new Date().getFullYear();


/* Custom Cursor Logic */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot moves instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline moves with slight delay (animation in CSS or simple lerp here)
    // Using simple animate for smoother follow
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// 3D Tilt Effect for Glass Cards
const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Add dynamic shine/glare
        // Removing old shine if exists to reuse or just updating background
        // Ideally we would add a shine element, but updating gradient is lighter
        // card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), rgba(255,255,255,0) 80%), rgba(255, 255, 255, 0.45)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        // card.style.background = 'rgba(255, 255, 255, 0.45)'; // Reset to original glass
    });
});

// Gold Dust Cursor Trail
document.addEventListener('mousemove', function(e) {
    if (Math.random() < 0.1) { // Create particle only 10% of the time to avoid clutter
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    document.body.appendChild(particle);
    
    const size = Math.random() * 5 + 2; // Size between 2px and 7px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Add slight random movement
    const destinationX = x + (Math.random() - 0.5) * 50;
    const destinationY = y + (Math.random() - 0.5) * 50;
    
    // Clean up
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Add hover effect for links and interactive elements
const interactives = document.querySelectorAll('a, button, .glass-card, .floating-dock');

interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
    });
});
