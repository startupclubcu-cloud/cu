// --- NAVBAR SCROLL EFFECT ---
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    let force = (1 - (dist / 150)) * 12; // Instant sharp pull
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }
            }
        }

        draw() {
            // Opacity is lower on left side (for text readability)
            let xFactor = Math.pow(Math.max(0.05, Math.min(1, this.x / width)), 0.6); // slight curve
            ctx.globalAlpha = xFactor;

            let currentSize = this.size;
            let currentGlow = 10 * xFactor;

            // Instant Reaction to Cursor
            if (mouse.active) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    currentSize += 1.5; // Instant increase
                    currentGlow += 15;  // Instant glow
                }
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = currentGlow; // soft glow scales down on left
            ctx.shadowColor = this.color;
            ctx.fill();

            ctx.globalAlpha = 1.0; // Reset
            ctx.shadowBlur = 0;
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

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect close particles with lines
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    let distOpacity = 1 - (dist / 150);

                    // Line opacity also depends on horizontal position (average of two points)
                    let avgX = (particles[i].x + particles[j].x) / 2;
                    let xOpacity = Math.pow(Math.max(0.05, Math.min(1, avgX / width)), 0.8);

                    let finalOpacity = distOpacity * xOpacity * 0.4;
                    ctx.strokeStyle = `rgba(102, 252, 241, ${finalOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Instant Cursor Connections (Max 5)
        if (mouse.active) {
            let activeConnections = [];
            for (let i = 0; i < particles.length; i++) {
                let dx = mouse.x - particles[i].x;
                let dy = mouse.y - particles[i].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    activeConnections.push({ p: particles[i], dist: dist });
                }
            }

            // Sort by distance
            activeConnections.sort((a, b) => a.dist - b.dist);
            // Limit to max 5 nearest particles to avoid cluttering and optimize performance
            let limit = Math.min(5, activeConnections.length);

            for (let i = 0; i < limit; i++) {
                let p = activeConnections[i].p;
                let xFactor = Math.pow(Math.max(0.05, Math.min(1, p.x / width)), 0.6);

                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(p.x, p.y);
                // Clean visibility without over-glow
                ctx.strokeStyle = `rgba(188, 19, 254, ${0.8 * xFactor})`;
                ctx.lineWidth = 1.0;
                ctx.stroke();
            }
        }
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

