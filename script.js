// --- NAVBAR SCROLL EFFECT ---
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// --- MOBILE MENU TOGGLE ---
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// --- EMAILJS CONFIGURATION ---
// IMPORTANT: User needs to update these keys from their EmailJS dashboard!
// Go to https://dashboard.emailjs.com/
const EMAILJS_PUBLIC_KEY = "LmyU8W6g9H6lZbMBt"; // e.g., "user_xxxxxxxxx"
const EMAILJS_SERVICE_ID = "service_gdzkish"; // e.g., "service_xxxxx"
const EMAILJS_FEEDBACK_TEMPLATE_ID = "template_f7c017a"; // e.g., "template_xxxxx"
const EMAILJS_SUGGEST_TEMPLATE_ID = "template_evnpb9j"; // e.g., "template_yyyyy"

// Initialize EmailJS
(function () {
    // Only init if real key is provided to avoid console errors
    if (EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Form Submission Handler Helper
async function handleFormSubmit(form, templateId, getFormData, statusEl, btnSpan, loader) {
    // Basic validation & state changes
    btnSpan.style.display = 'none';
    loader.classList.remove('hidden');
    statusEl.textContent = "Sending...";
    statusEl.className = "form-status";

    // Check if keys are configured
    if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        setTimeout(() => {
            statusEl.textContent = "Error: EmailJS is not configured yet! Follow the instructions provided to add your keys in script.js";
            statusEl.className = "form-status status-error";
            btnSpan.style.display = 'inline';
            loader.classList.add('hidden');
        }, 1000);
        return;
    }

    try {
        const templateParams = getFormData();

        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            templateId,
            templateParams
        );

        statusEl.textContent = "Message sent successfully! 🚀";
        statusEl.className = "form-status status-success";
        form.reset();

    } catch (error) {
        console.error("EmailJS Error:", error);
        statusEl.textContent = "Failed to send message. Please check console.";
        statusEl.className = "form-status status-error";
    } finally {
        btnSpan.style.display = 'inline';
        loader.classList.add('hidden');

        // Clear success/error message after 5 seconds
        setTimeout(() => {
            statusEl.textContent = "";
        }, 5000);
    }
}

// Setup Feedback Form
const feedbackForm = document.getElementById('feedback-form');
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btnSpan = feedbackForm.querySelector('.submit-btn span');
    const loader = feedbackForm.querySelector('.loader');
    const statusEl = document.getElementById('fb-status');

    handleFormSubmit(
        feedbackForm,
        EMAILJS_FEEDBACK_TEMPLATE_ID,
        () => ({
            from_name: document.getElementById('fb-name').value,
            reply_to: document.getElementById('fb-email').value,
            event_name: document.getElementById('fb-event').value,
            message: document.getElementById('fb-message').value,
            to_email: "vicepresident@startupclubcu.online"
        }),
        statusEl,
        btnSpan,
        loader
    );
});

// Setup Suggestions Form
const suggestForm = document.getElementById('suggest-form');
suggestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btnSpan = suggestForm.querySelector('.submit-btn span');
    const loader = suggestForm.querySelector('.loader');
    const statusEl = document.getElementById('sg-status');

    handleFormSubmit(
        suggestForm,
        EMAILJS_SUGGEST_TEMPLATE_ID,
        () => ({
            from_name: document.getElementById('sg-name').value,
            reply_to: document.getElementById('sg-email').value,
            message: document.getElementById('sg-message').value,
            type: "New Idea Suggestion",
            to_email: "vicepresident@startupclubcu.online"
        }),
        statusEl,
        btnSpan,
        loader
    );
});

// --- SCROLL ANIMATIONS (Intersection Observer) ---
// Add fade-in classes to elements you want to animate on scroll
document.querySelectorAll('.section-title, .glass-card, .about-text').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    el.style.willChange = 'opacity, transform';
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Remove will-change after transition finishes
            setTimeout(() => { entry.target.style.willChange = 'auto'; }, 600);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .glass-card, .about-text').forEach((el) => {
    observer.observe(el);
});

// --- NETWORK ANIMATION ---
const canvas = document.getElementById('network-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Parallax & Interactive Cursor Setup
    let mouse = { x: -1000, y: -1000, active: false };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    // Detect when mouse leaves window
    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    function resize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    window.addEventListener('resize', resize);

    const colors = [
        'rgba(102, 252, 241, 0.8)', // Cyan
        'rgba(188, 19, 254, 0.8)',  // Purple
        'rgba(0, 140, 255, 0.8)'    // Blue
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 0.7; // Slightly faster movement
            this.vy = (Math.random() - 0.5) * 0.7;
            this.size = Math.random() * 2 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            // Parallax offset strength
            this.parallaxFactor = Math.random() * 0.05 + 0.01;
        }

        update() {
            this.baseX += this.vx;
            this.baseY += this.vy;

            // Strict bounce off edges with clamping to prevent sticking
            if (this.baseX <= 0) {
                this.baseX = 0;
                this.vx *= -1;
            } else if (this.baseX >= width) {
                this.baseX = width;
                this.vx *= -1;
            }

            if (this.baseY <= 0) {
                this.baseY = 0;
                this.vy *= -1;
            } else if (this.baseY >= height) {
                this.baseY = height;
                this.vy *= -1;
            }

            // Calculate parallax based on mouse distance from center
            let centerX = window.innerWidth / 2;
            let centerY = window.innerHeight / 2;
            let offsetX = (mouse.x - centerX) * this.parallaxFactor;
            let offsetY = (mouse.y - centerY) * this.parallaxFactor;

            this.x = this.baseX - offsetX;
            this.y = this.baseY - offsetY;

            // Instant Cursor Attraction
            if (mouse.active) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < 22500) { // 150 * 150
                    let dist = Math.sqrt(distSq);
                    let force = (1 - (dist / 150)) * 12; // Instant sharp pull
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }
            }
        }

        draw() {
            // Fast linear opacity mapping instead of Math.pow
            let xFactor = Math.max(0.05, Math.min(1, this.x / width)); 

            let currentSize = this.size;
            let currentGlow = 10 * xFactor;

            // Instant Reaction to Cursor
            if (mouse.active) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < 22500) { // 150*150
                    currentSize += 1.5; // Instant increase
                    currentGlow += 15;  // Instant glow
                }
            }

            // Draw Glow (Fake shadowBlur for better performance)
            if (currentGlow > 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentSize + currentGlow * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = xFactor * 0.15; // very transparent glow
                ctx.fill();
            }

            // Draw Core
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = xFactor;
            ctx.fill();

            ctx.globalAlpha = 1.0; // Reset
        }
    }

    function initParticles() {
        particles = [];
        // Maximum density requested by user (120 to 250 particles)
        let count = Math.min(250, Math.max(120, Math.floor((width * height) / 4000)));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        // 1. Update all particles and calculate cursor interactions
        let activeCursorConnections = [];
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.update();
            
            // Cursor connection logic (moved from separate loop)
            if (mouse.active) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let distSq = dx * dx + dy * dy;
                if (distSq < 22500) { // 150 * 150
                    activeCursorConnections.push({ p: p, dist: Math.sqrt(distSq) });
                }
            }
        }

        // 2. Binning lines to drastically reduce ctx.stroke() calls (The secret to 60fps)
        const NUM_BINS = 10;
        const lineBins = Array.from({ length: NUM_BINS }, () => []);

        for (let i = 0; i < particles.length; i++) {
            let pI = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                let pJ = particles[j];
                let dx = pI.x - pJ.x;
                let dy = pI.y - pJ.y;
                let distSq = dx * dx + dy * dy;

                if (distSq < 14400) { // 120 * 120
                    let dist = Math.sqrt(distSq);
                    let distOpacity = 1 - (dist / 120);

                    // Line opacity also depends on horizontal position
                    let avgX = (pI.x + pJ.x) * 0.5;
                    let xOpacity = Math.max(0.05, Math.min(1, avgX / width));

                    let alphaVal = distOpacity * xOpacity * 0.4;
                    if (alphaVal > 0.01) {
                        let binIndex = Math.floor(alphaVal * (NUM_BINS / 0.4));
                        if (binIndex >= NUM_BINS) binIndex = NUM_BINS - 1;
                        if (binIndex < 0) binIndex = 0;
                        lineBins[binIndex].push(pI.x, pI.y, pJ.x, pJ.y);
                    }
                }
            }
        }

        // 3. Draw lines in batches by opacity
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#66fcf1';
        
        for (let b = 0; b < NUM_BINS; b++) {
            if (lineBins[b].length === 0) continue;
            ctx.beginPath();
            let bin = lineBins[b];
            for (let k = 0; k < bin.length; k += 4) {
                ctx.moveTo(bin[k], bin[k+1]);
                ctx.lineTo(bin[k+2], bin[k+3]);
            }
            ctx.globalAlpha = (b + 1) * (0.4 / NUM_BINS);
            ctx.stroke(); // 10 strokes per frame instead of ~5,000+
        }

        // 4. Draw Particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
        }

        // 5. Draw Cursor Connections
        if (mouse.active && activeCursorConnections.length > 0) {
            activeCursorConnections.sort((a, b) => a.dist - b.dist);
            let limit = Math.min(5, activeCursorConnections.length);

            ctx.lineWidth = 1.0;
            ctx.strokeStyle = '#bc13fe';

            for (let i = 0; i < limit; i++) {
                let p = activeCursorConnections[i].p;
                let xFactor = Math.max(0.05, Math.min(1, p.x / width));

                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(p.x, p.y);
                ctx.globalAlpha = 0.8 * xFactor;
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1.0; // Reset
    }

    resize();
    animate();
}

// --- LIVE IDEA FEED ---
const ideas = [
    '"Food waste reduction app"',
    '"Campus ride sharing"',
    '"AI notes generator"',
    '"Smart attendance system"',
    '"Student marketplace platform"',
    '"Virtual reality campus tour"'
];

const ideaText = document.getElementById('live-idea-text');
const ideaFeed = document.querySelector('.live-idea-feed');
let currentIdeaIndex = 0;
let ideaInterval;

function changeIdea() {
    // Fade out upward
    ideaText.classList.add('idea-fade-out');

    setTimeout(() => {
        currentIdeaIndex = (currentIdeaIndex + 1) % ideas.length;
        ideaText.textContent = ideas[currentIdeaIndex];

        // Prepare to fade in from below
        ideaText.classList.remove('idea-fade-out');
        ideaText.classList.add('idea-fade-in');

        // Trigger reflow to restart transition
        void ideaText.offsetWidth;

        // Fade in
        ideaText.classList.remove('idea-fade-in');
    }, 500); // Wait for fade-out to finish
}

function startIdeaFeed() {
    ideaInterval = setInterval(changeIdea, 3500);
}

if (ideaText && ideaFeed) {
    startIdeaFeed();

    // Pause on hover
    ideaFeed.addEventListener('mouseenter', () => clearInterval(ideaInterval));
    ideaFeed.addEventListener('mouseleave', startIdeaFeed);
}

