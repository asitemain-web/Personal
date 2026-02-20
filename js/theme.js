// Theme toggle functionality
const STORAGE_KEY = "fa-personal-site-theme";

let updateHeaderBackgroundCallback = null;

function setUpdateHeaderBackgroundCallback(callback) {
  updateHeaderBackgroundCallback = callback;
}

function updateThemeColorMeta(isDark) {
  const head = document.head;
  if (!head) return;

  let themeColorMeta = document.querySelector(
    'meta[name="theme-color"]:not([media])'
  );
  if (!themeColorMeta) {
    themeColorMeta = document.createElement("meta");
    themeColorMeta.setAttribute("name", "theme-color");
    head.appendChild(themeColorMeta);
  }

  themeColorMeta.setAttribute("content", isDark ? "#ffffff" : "#000000");
}

function applyStoredTheme() {
  try {
    const root = document.documentElement;
    const saved = localStorage.getItem(STORAGE_KEY);
    const isDark = saved === "dark";
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    updateThemeColorMeta(isDark);
    setTimeout(() => {
      if (updateHeaderBackgroundCallback) {
        updateHeaderBackgroundCallback();
      }
    }, 10);
  } catch (error) {
    // خطا در اعمال تم
  }
}

function toggleTheme() {
  try {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    updateThemeColorMeta(isDark);
    setTimeout(() => {
      if (updateHeaderBackgroundCallback) {
        updateHeaderBackgroundCallback();
      }
    }, 10);
  } catch (error) {
    // خطا در تغییر تم
  }
}

function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function (e) {
      e.preventDefault();
      toggleTheme();
    });
  }
  applyStoredTheme();
}
