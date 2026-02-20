// Skills rendering
// Convert hex to rgb for rgba usage
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

// Convert color (hex or named) to rgba string
function colorToRgba(color, opacity = 1) {
  // If it's a hex color, convert it
  if (color.startsWith("#")) {
    const rgb = hexToRgb(color);
    if (rgb) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }
  }
  // For named colors, create a temporary element to get computed color
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);

  // Extract rgb values from computed color (format: "rgb(r, g, b)" or "rgba(r, g, b, a)")
  const rgbMatch = computed.match(/\d+/g);
  if (rgbMatch && rgbMatch.length >= 3) {
    return `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, ${opacity})`;
  }

  // Fallback
  return color;
}

function getLevelFromPercent(percent) {
  if (percent >= 90) return "Advanced";
  if (percent >= 70) return "Intermediate";
  if (percent >= 40) return "Beginner";
  return "Starter";
}

function renderSkills() {
  const skillsGrid = document.getElementById("skillsGrid");
  if (!skillsGrid) return;

  skillsGrid.innerHTML = skillsData
    .map((skill) => {
      const color = skill.color || "#10b981";
      const percentRaw = Number(skill.percent);
      const percent = Number.isFinite(percentRaw)
        ? Math.max(0, Math.min(100, percentRaw))
        : 0;
      const track = colorToRgba(color, 0.16);
      const level = getLevelFromPercent(percent);

      return `
        <div class="skill-card" style="--skill-color:${color}; --skill-track:${track};" data-skill="${skill.name}" data-percent="${percent}" data-level="${level}">
            <svg class="skill-ring" viewBox="0 0 120 120" aria-hidden="true">
                <circle class="skill-ring-track" cx="60" cy="60" r="52"></circle>
                <circle class="skill-ring-progress" cx="60" cy="60" r="52"></circle>
            </svg>
            <div class="skill-inner" aria-label="${skill.name}">
                <img src="${skill.icon}" alt="${skill.name}" class="skill-icon" title="${skill.name}">
            </div>
            <div class="skill-tooltip" role="tooltip">
                <div class="skill-tooltip-title">${skill.name}</div>
            </div> 
        </div>
        `;
    })
    .join("");
}

function initSkillCardsAnimations() {
  const cards = document.querySelectorAll(".skill-card");
  if (!cards.length) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function prepareCard(card) {
    const ring = card.querySelector(".skill-ring-progress");
    if (!ring) return;
    const r = Number(ring.getAttribute("r")) || 52;
    const circumference = 2 * Math.PI * r;

    ring.style.strokeDasharray = String(circumference);
    ring.style.strokeDashoffset = String(circumference);

    const percent = Number(card.dataset.percent) || 0;
    const targetOffset = circumference * (1 - percent / 100);
    card.dataset.targetOffset = String(targetOffset);
  }

  cards.forEach(prepareCard);

  const revealOnce = new WeakSet();

  function revealAndAnimate(card) {
    if (revealOnce.has(card)) return;
    revealOnce.add(card);
    card.classList.add("is-visible");

    const ring = card.querySelector(".skill-ring-progress");
    if (!ring) return;

    const targetOffset = Number(card.dataset.targetOffset);
    if (!Number.isFinite(targetOffset)) return;

    if (prefersReducedMotion) {
      ring.style.transitionDuration = "0ms";
      ring.style.strokeDashoffset = String(targetOffset);
      return;
    }

    ring.style.transition =
      "stroke-dashoffset 1200ms cubic-bezier(0.16, 1, 0.3, 1)";
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = String(targetOffset);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAndAnimate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  cards.forEach((card) => observer.observe(card));
}

function initSkillTooltips() {
  const cards = document.querySelectorAll(".skill-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    let timeoutId = null;

    function hideTooltip() {
      card.classList.remove("show-tooltip");
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }

    card.addEventListener("click", (event) => {
      event.stopPropagation();
      card.classList.add("show-tooltip");

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(hideTooltip, 1000);
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".skill-card.show-tooltip").forEach((card) => {
      card.classList.remove("show-tooltip");
    });
  });
}

function initSkills() {
  renderSkills();
  initSkillCardsAnimations();
  initSkillTooltips();
}
