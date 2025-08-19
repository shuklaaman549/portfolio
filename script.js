/* ========= Smooth anchor scroll ========= */
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const href = link.getAttribute("href");
  if (href === "#") return;

  const target = document.querySelector(href);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

/* ========= Mobile nav toggle ========= */
(() => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((n) => {
    n.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
})();

/* ========= Navbar state + active section highlight ========= */
(() => {
  const navbar = document.getElementById("navbar");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("section"));

  const setNavScrolled = () => {
    if (!navbar) return;
    if (window.scrollY > 100) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };

  const setActiveLink = () => {
    let current = "";
    const offset = 200;
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.getAttribute("id") || "";
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  const onScroll = () => {
    setNavScrolled();
    setActiveLink();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ========= Timeline/Project animations (play CSS animations when visible) ========= */
(() => {
  const animatedEls = document.querySelectorAll(
    ".timeline-item, .project-card"
  );
  if (!animatedEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  animatedEls.forEach((el) => io.observe(el));
})();

/* ========= Page loaded flag (if needed by CSS) ========= */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ========= Rotating typewriter ========= */
function rotatingTypeWriter() {
  const roles = ["Cloud Engineer", "Data Analyst", "Software Developer"];
  const roleElement = document.getElementById("roleText");
  if (!roleElement) return;

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

/* ========= Add float animation class to sections when in view ========= */
function addSectionAnimations() {
  const sections = document.querySelectorAll("section");
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-animate");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => io.observe(section));
}

/* ========= Theme toggle + responsive background ========= */
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  if (!themeToggle) return;

  const icon = themeToggle.querySelector("i");
  const setIcon = () => {
    if (!icon) return;
    icon.className = body.classList.contains("light-theme")
      ? "fas fa-moon"
      : "fas fa-sun";
  };

  const currentTheme = localStorage.getItem("theme") || "dark";
  if (currentTheme === "light") body.classList.add("light-theme");
  setIcon();
  setResponsiveBackground();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    localStorage.setItem(
      "theme",
      body.classList.contains("light-theme") ? "light" : "dark"
    );
    setIcon();
    setResponsiveBackground();
  });
}

function setResponsiveBackground() {
  const backgroundContainer = document.getElementById("backgroundContainer");
  if (!backgroundContainer) return;

  const isLightTheme = document.body.classList.contains("light-theme");
  const width = window.innerWidth;

  let backgroundImage;
  if (width >= 1024) {
    backgroundImage = isLightTheme
      ? "./assets/light-room.png"
      : "./assets/dark-room.png";
  } else if (width >= 768) {
    backgroundImage = isLightTheme
      ? "./assets/light-room2.png"
      : "./assets/dark-room2.png";
  } else {
    backgroundImage = isLightTheme
      ? "./assets/light-room1.png"
      : "./assets/dark-room1.png";
  }

  backgroundContainer.style.backgroundImage = `url('${backgroundImage}')`;
}

let resizeTimeout;
window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setResponsiveBackground, 250);
  },
  { passive: true }
);

/* ========= Contact form (EmailJS) ========= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const SERVICE_ID = "service_0jgil8l";
      const TEMPLATE_ID_ACK = "template_pjgwhz8";
      const TEMPLATE_ID_OWNER = "template_vjzbn7c";

      const templateParams = { name, email, subject, message };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID_OWNER, templateParams);
      await emailjs.send(SERVICE_ID, TEMPLATE_ID_ACK, templateParams);

      alert("Thank you! Your message has been sent.");
      form.reset();
    } catch (err) {
      console.error(err);
      alert(
        "Sorry, something went wrong while sending your message. Please try again later."
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ========= Boot ========= */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  setTimeout(rotatingTypeWriter, 500);
  addSectionAnimations();
  initContactForm();
});
