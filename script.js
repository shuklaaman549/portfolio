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

document.querySelectorAll('.nav-link').forEach(n =>
  n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  })
);

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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.timeline-item, .project-card').forEach(el => {
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
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-animate');
      }
    });
  }, { threshold: 0.1 });

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
  body.style.backgroundAttachment = 'scroll';
}

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(setResponsiveBackground, 250);
});

function initSkillsStack() {
  const rows = document.querySelectorAll('#skills.skills-revamp .skill-row');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.skill-card').classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  rows.forEach(row => {
    const fill = row.querySelector('.skill-fill');
    const range = row.querySelector('.skill-range');
    const label = row.querySelector('.skill-level');
    const initial = parseInt(row.dataset.level, 10) || 0;
    fill.style.width = initial + '%';
    label.textContent = initial + '%';
    range.value = initial;

    range.addEventListener('input', () => {
      const val = range.value;
      fill.style.width = val + '%';
      label.textContent = val + '%';
    });

    observer.observe(row);
  });

  const handleStacking = () => {
    const cards = document.querySelectorAll('#skills.skills-revamp .skill-card');
    const skillsSection = document.querySelector('#skills.skills-revamp');
    if (!skillsSection) return;

    const sectionRect = skillsSection.getBoundingClientRect();
    const sectionBottom = sectionRect.bottom;
    const sectionTop = sectionRect.top;

    if (sectionTop < window.innerHeight && sectionBottom > 0) {
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const stickyTop = 120;

        for (let i = 1; i <= 27; i++) {
          card.classList.remove(`is-stacked-${i}`);
        }
        if (cardRect.top <= stickyTop) {
          let stackLevel = 0;
          cards.forEach((otherCard, otherIndex) => {
            if (otherIndex < index) {
              const otherRect = otherCard.getBoundingClientRect();
              if (otherRect.top <= stickyTop) {
                stackLevel++;
              }
            }
          });
          if (stackLevel > 0 && stackLevel <= 27) {
            card.classList.add(`is-stacked-${stackLevel}`);
          }
        }
      });
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleStacking();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  setTimeout(rotatingTypeWriter, 500);
  addSectionAnimations();

  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const SERVICE_ID = 'service_0jgil8l';
      const TEMPLATE_ID_ACK = 'template_pjgwhz8';
      const TEMPLATE_ID_OWNER = 'template_vjzbn7c';

      const templateParams = { name, email, subject, message };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID_OWNER, templateParams);
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_ACK, templateParams);

      alert("Thank you! Your message has been sent.");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Sorry, something went wrong while sending your message. Please try again later.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalText;
    }
  });

  initSkillsStack();
});
