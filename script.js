/**
 * Aman Chauhan Portfolio - Interactive Script
 * Features: Network visualization, scroll animations, counters, skill graph
 */

// ========================================
// UTILITIES
// ========================================

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

const lerp = (a, b, t) => a + (b - a) * t;

// ========================================
// NAVIGATION
// ========================================

const initNavigation = () => {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 10));
    
    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                navLinks.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};

// ========================================
// HERO NETWORK CANVAS
// ========================================

const initNetworkCanvas = () => {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let animationId;
    let mouse = { x: -1000, y: -1000 };
    
    const NODE_COUNT = 60;
    const CONNECTION_DISTANCE = 150;
    const MOUSE_CONNECTION_DISTANCE = 200;
    
    class Node {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.02;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            
            this.pulsePhase += this.pulseSpeed;
        }
        
        draw() {
            const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * pulse, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${0.4 * pulse})`;
            ctx.fill();
            
            // Glow for larger nodes
            if (this.radius > 2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * pulse * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${0.05 * pulse})`;
                ctx.fill();
            }
        }
    }
    
    const resize = () => {
        width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        width /= window.devicePixelRatio;
        height /= window.devicePixelRatio;
    };
    
    const init = () => {
        resize();
        nodes = Array.from({ length: NODE_COUNT }, () => new Node());
    };
    
    const drawConnections = () => {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            
            // Mouse connections
            const mdx = nodes[i].x - mouse.x;
            const mdy = nodes[i].y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            
            if (mDist < MOUSE_CONNECTION_DISTANCE) {
                const opacity = (1 - mDist / MOUSE_CONNECTION_DISTANCE) * 0.3;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    };
    
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    };
    
    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    });
    
    canvas.addEventListener('touchend', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    window.addEventListener('resize', debounce(() => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    }, 250));
    
    init();
    animate();
};

// ========================================
// ANIMATED COUNTERS
// ========================================

const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();
        
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(ease * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(update);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
};

// ========================================
// SCROLL REVEAL
// ========================================

const initScrollReveal = () => {
    const revealElements = document.querySelectorAll(
        '.section-header, .expertise-card, .project-card, .timeline-item, .method-card, .skill-cluster'
    );
    
    revealElements.forEach(el => el.classList.add('reveal'));
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger for cards
                const parent = entry.target.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
                
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
};

// ========================================
// SKILLS CANVAS VISUALIZATION
// ========================================

const initSkillsCanvas = () => {
    const canvas = document.getElementById('skillsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    
    const PARTICLE_COUNT = 50;
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 0.5;
            this.angle = Math.random() * Math.PI * 2;
            this.orbitRadius = 20 + Math.random() * 60;
            this.orbitSpeed = 0.005 + Math.random() * 0.01;
            this.centerX = width / 2;
            this.centerY = height / 2;
            this.type = Math.floor(Math.random() * 5); // 5 clusters
        }
        
        update() {
            this.angle += this.orbitSpeed;
            
            // Cluster-based positioning
            const clusterAngles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];
            const baseAngle = clusterAngles[this.type];
            
            const targetX = this.centerX + Math.cos(baseAngle + this.angle) * this.orbitRadius;
            const targetY = this.centerY + Math.sin(baseAngle + this.angle) * this.orbitRadius * 0.6;
            
            this.x = lerp(this.x, targetX, 0.02);
            this.y = lerp(this.y, targetY, 0.02);
        }
        
        draw() {
            const colors = [
                'rgba(0, 212, 255, 0.6)',
                'rgba(0, 255, 136, 0.6)',
                'rgba(255, 140, 66, 0.6)',
                'rgba(255, 71, 87, 0.6)',
                'rgba(180, 140, 255, 0.6)'
            ];
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors[this.type];
            ctx.fill();
        }
    }
    
    const resize = () => {
        width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        width /= window.devicePixelRatio;
        height /= window.devicePixelRatio;
    };
    
    const init = () => {
        resize();
        particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    };
    
    const drawClusterConnections = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[i].type === particles[j].type) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 80) {
                        const opacity = (1 - dist / 80) * 0.15;
                        const colors = [
                            'rgba(0, 212, 255,',
                            'rgba(0, 255, 136,',
                            'rgba(255, 140, 66,',
                            'rgba(255, 71, 87,',
                            'rgba(180, 140, 255,'
                        ];
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `${colors[particles[i].type]} ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
    };
    
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Draw cluster labels
        const clusterNames = ['Analytics', 'Optimization', 'Simulation', 'Manufacturing', 'Data Science'];
        const clusterAngles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];
        
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        
        clusterNames.forEach((name, i) => {
            const x = width / 2 + Math.cos(clusterAngles[i]) * 80;
            const y = height / 2 + Math.sin(clusterAngles[i]) * 50;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillText(name, x, y);
        });
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawClusterConnections();
        
        animationId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', debounce(() => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    }, 250));
    
    init();
    animate();
};

// ========================================
// PARALLAX EFFECTS
// ========================================

const initParallax = () => {
    const heroContent = document.querySelector('.hero-content');
    const aboutVisual = document.querySelector('.about-visual');
    
    window.addEventListener('scroll', debounce(() => {
        const scrollY = window.scrollY;
        
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
        }
        
        if (aboutVisual) {
            const rect = aboutVisual.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) * 0.05;
                aboutVisual.style.transform = `translateY(${offset}px)`;
            }
        }
    }, 10));
};

// ========================================
// INTERSECTION OBSERVER FOR TIMELINE
// ========================================

const initTimelineObserver = () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => observer.observe(item));
};

// ========================================
// TERMINAL TYPEWRITER EFFECT
// ========================================

const initTerminalEffect = () => {
    const terminal = document.querySelector('.contact-terminal');
    if (!terminal) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a subtle glow effect when in view
                terminal.style.boxShadow = '0 0 60px rgba(0, 212, 255, 0.1)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(terminal);
};

// ========================================
// PROJECT CARD HOVER EFFECTS
// ========================================

const initProjectCards = () => {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const visual = card.querySelector('.project-visual');
            if (visual) {
                visual.style.transform = 'scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const visual = card.querySelector('.project-visual');
            if (visual) {
                visual.style.transform = 'scale(1)';
            }
        });
    });
};

// ========================================
// SKILL CLUSTER INTERACTION
// ========================================

const initSkillClusters = () => {
    const clusters = document.querySelectorAll('.skill-cluster');
    
    clusters.forEach(cluster => {
        const items = cluster.querySelectorAll('.skill-item');
        
        cluster.addEventListener('mouseenter', () => {
            items.forEach((item, i) => {
                setTimeout(() => {
                    item.style.transform = 'translateY(-4px)';
                    item.style.borderColor = 'var(--border-accent)';
                }, i * 30);
            });
        });
        
        cluster.addEventListener('mouseleave', () => {
            items.forEach(item => {
                item.style.transform = '';
                item.style.borderColor = '';
            });
        });
    });
};

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initNetworkCanvas();
    initCounters();
    initScrollReveal();
    initSkillsCanvas();
    initParallax();
    initTimelineObserver();
    initTerminalEffect();
    initProjectCards();
    initSkillClusters();
});
