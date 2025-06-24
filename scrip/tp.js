// Variables globales
let activeSection = "home";
let isMenuOpen = false;

// Inicialización cuando carga la página
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeScrollEffects();
  initializeSkillBars();
  initializeContactForm();
  initializeMobileMenu();
});

// Navegación
function initializeNavigation() {
  // Manejo del scroll para navegación activa
  window.addEventListener("scroll", handleScroll);

  // Event listeners para los enlaces de navegación
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });
}

function handleScroll() {
  const sections = ["home", "about", "skills", "projects", "contact"];
  const scrollPosition = window.scrollY + 100;

  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (
        scrollPosition >= offsetTop &&
        scrollPosition < offsetTop + offsetHeight
      ) {
        setActiveSection(section);
        break;
      }
    }
  }

  // Animaciones en scroll
  animateOnScroll();
}

function setActiveSection(sectionId) {
  if (activeSection !== sectionId) {
    activeSection = sectionId;

    // Actualizar navegación desktop
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });

    // Actualizar navegación móvil
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("active");
      }
    });
  }
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Cerrar menú móvil si está abierto
  if (isMenuOpen) {
    toggleMobileMenu();
  }
}

// Menú móvil
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuIcon = document.querySelector(".mobile-menu-btn i");

  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenu.classList.add("show");
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
  } else {
    mobileMenu.classList.remove("show");
    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");
  }
}

// Efectos de scroll
function initializeScrollEffects() {
  // Agregar clase para animaciones
  const elementsToAnimate = document.querySelectorAll(
    ".feature-card, .skill-category, .project-card"
  );
  elementsToAnimate.forEach((element) => {
    element.classList.add("animate-on-scroll");
  });
}

function animateOnScroll() {
  const elements = document.querySelectorAll(".animate-on-scroll");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("animate");
    }
  });
}

// Barras de habilidades
function initializeSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.unobserve(entry.target);
      }
    });
  });

  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    setTimeout(() => {
      bar.style.width = width + "%";
    }, 200);
  });
}

// Formulario de contacto
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
}

function handleContactSubmit(e) {
  e.preventDefault();

  // Obtener datos del formulario
  const formData = new FormData(e.target);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  console.log("Formulario enviado:", data);

  // Mostrar mensaje de éxito
  showToast(
    "Mensaje enviado",
    "Gracias por contactarme. Te responderé pronto."
  );

  // Limpiar formulario
  e.target.reset();
}

// Sistema de notificaciones toast
function showToast(title, message) {
  // Crear elemento toast
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
        <div>
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
    `;

  // Agregar al DOM
  document.body.appendChild(toast);

  // Mostrar toast
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Ocultar toast después de 3 segundos
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Smooth scroll para navegadores que no lo soportan
function smoothScrollTo(element, duration = 1000) {
  const targetPosition = element.offsetTop - 80; // Offset para navbar fija
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Optimización de rendimiento para scroll
let ticking = false;

function optimizedScroll() {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
  }
}

// Reemplazar el event listener de scroll normal
window.removeEventListener("scroll", handleScroll);
window.addEventListener("scroll", optimizedScroll);

// Lazy loading para imágenes
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Inicializar lazy loading si hay imágenes con data-src
document.addEventListener("DOMContentLoaded", initializeLazyLoading);

// Manejo de errores globales
window.addEventListener("error", function (e) {
  console.error("Error en la aplicación:", e.error);
});

// Función para resetear el estado de scroll cuando se detecta un cambio de ticking
function resetTicking() {
  ticking = false;
}

// Agregar el reset al final de handleScroll
const originalHandleScroll = handleScroll;
handleScroll = function () {
  originalHandleScroll();
  resetTicking();
};
