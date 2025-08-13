document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

document.querySelector('.contact-form form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelectorAll('input[type="text"]')[1].value;
    const message = this.querySelector('textarea').value;
    
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    alert('Thank you for your message! I\'ll get back to you soon.');
    this.reset();
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(el => {
    observer.observe(el);
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

function rotatingTypeWriter() {
    const roles = ['Cloud Engineer', 'Data Analyst', 'Software Developer'];
    const roleElement = document.getElementById('roleText');
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[currentRoleIndex];
        
        if (!isDeleting) {
            roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentRole.length) {
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 1200);
                return;
            }
            
            setTimeout(type, 100);
        } else {
            roleElement.textContent = currentRole.substring(0, currentCharIndex);
            currentCharIndex--;
            
            if (currentCharIndex < 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                currentCharIndex = 0;
                setTimeout(type, 200); 
                return;
            }
            
            setTimeout(type, 50); 
        }
    }
    
    type();
}

function addSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        icon.className = 'fas fa-moon';
    }
    
    setResponsiveBackground();
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
        
        setResponsiveBackground();
    });
}

function setResponsiveBackground() {
    const body = document.body;
    const isLightTheme = body.classList.contains('light-theme');
    const width = window.innerWidth;
    
    let backgroundImage;
    
    if (width >= 1024) {
        backgroundImage = isLightTheme ? './assets/light-room.png' : './assets/dark-room.png';
    } else if (width >= 768) {
        backgroundImage = isLightTheme ? './assets/light-room2.png' : './assets/dark-room2.png';
    } else {
        backgroundImage = isLightTheme ? './assets/light-room1.png' : './assets/dark-room1.png';
    }
    
    body.style.backgroundImage = `url('${backgroundImage}')`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setResponsiveBackground, 250);
});

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    
    setTimeout(() => {
        rotatingTypeWriter();
    }, 500);
    
    addSectionAnimations();
});
