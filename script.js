// ============================================
//   GABRIEL BOTELHO — PORTFOLIO SCRIPTS
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // --- CURSOR PERSONALIZADO ---
  const cursor = document.querySelector(".cursor");
  const trail = document.querySelector(".cursor-trail");
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + "px";
    trail.style.top = trailY + "px";
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(0.7)";
    trail.style.transform = "translate(-50%, -50%) scale(1.4)";
  });

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    trail.style.transform = "translate(-50%, -50%) scale(1)";
  });

  // Esconde cursor padrão nos elementos interativos
  document.querySelectorAll("a, button, input, textarea").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
      trail.style.transform = "translate(-50%, -50%) scale(1.8)";
      trail.style.borderColor = "rgba(0, 212, 255, 0.7)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      trail.style.transform = "translate(-50%, -50%) scale(1)";
      trail.style.borderColor = "rgba(0, 212, 255, 0.4)";
    });
  });


  // --- CANVAS DE PARTÍCULAS ---
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? "0, 212, 255" : "0, 255, 136";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();


  // --- HEADER SCROLL EFEITO ---
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


  // --- SMOOTH SCROLL COM OFFSET ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });


  // --- ANIMAÇÃO DE ENTRADA NAS SEÇÕES (IntersectionObserver) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".projeto-card, .formacao-card, .skills-grid").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });


  // --- FORMULÁRIO DE CONTATO ---
  const formulario = document.getElementById("meu-formulario");
  const submitBtn = formulario.querySelector("button[type='submit']");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) {
      shakeForm();
      return;
    }

    // Estado de loading
    submitBtn.disabled = true;
    submitBtn.querySelector("span:first-child").textContent = "Enviando...";

    setTimeout(() => {
      submitBtn.querySelector("span:first-child").textContent = "✓ Mensagem Enviada!";
      submitBtn.style.background = "var(--accent-2)";

      setTimeout(() => {
        formulario.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector("span:first-child").textContent = "Enviar Mensagem";
        submitBtn.style.background = "";
      }, 3000);
    }, 1200);
  });

  function shakeForm() {
    formulario.style.animation = "none";
    formulario.offsetHeight; // reflow
    formulario.style.animation = "shake 0.4s ease";

    setTimeout(() => {
      formulario.style.animation = "";
    }, 400);
  }

  // Adiciona keyframe de shake via JS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

});
