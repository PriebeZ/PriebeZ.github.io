(function init() {
  const profile = window.profileData;
  const storageKey = "resume-locale";

  function getSupportedLocales() {
    if (profile?.locales) return Object.keys(profile.locales);
    return ["zh-CN"];
  }

  function normalizeLocale(locale) {
    const supported = getSupportedLocales();
    const defaultLocale = profile?.defaultLocale || supported[0] || "zh-CN";
    return supported.includes(locale) ? locale : defaultLocale;
  }

  function readStoredLocale() {
    try {
      return window.localStorage.getItem(storageKey) || "";
    } catch {
      return "";
    }
  }

  function writeStoredLocale(locale) {
    try {
      window.localStorage.setItem(storageKey, locale);
    } catch {
      // Ignore storage failures in private or restricted contexts.
    }
  }

  function detectLocale() {
    const stored = readStoredLocale();
    if (stored) return normalizeLocale(stored);

    const language = String(window.navigator.language || "").toLowerCase();
    if (language.startsWith("zh-tw") || language.startsWith("zh-hk") || language.startsWith("zh-mo")) {
      return normalizeLocale("zh-TW");
    }
    if (language.startsWith("en")) {
      return normalizeLocale("en");
    }
    return normalizeLocale(profile?.defaultLocale || "zh-CN");
  }

  function syncAnchorOffset() {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (!isMobile) {
      document.documentElement.style.setProperty("--anchor-offset", "24px");
      return;
    }

    const sidebar = document.querySelector(".sidebar");
    if (!sidebar || window.getComputedStyle(sidebar).display === "none") {
      const topBar = document.querySelector(".topBar");
      const topBarHeight = topBar ? Math.ceil(topBar.getBoundingClientRect().height) : 0;
      document.documentElement.style.setProperty("--anchor-offset", `${topBarHeight + 20}px`);
      return;
    }

    const rect = sidebar.getBoundingClientRect();
    const gap = 12;
    const offset = Math.ceil(rect.height + gap);
    document.documentElement.style.setProperty("--anchor-offset", `${offset}px`);
  }

  if (!profile) {
    const headline = document.getElementById("headline");
    const bio = document.getElementById("bio");
    if (headline) headline.textContent = "加载失败：缺少 data/profile.js";
    if (bio) bio.textContent = "请检查 data/profile.js 是否存在并正确引入。";
    return;
  }

  let currentLocale = detectLocale();

  function applyLocale(locale) {
    currentLocale = normalizeLocale(locale);
    writeStoredLocale(currentLocale);
    window.renderProfile(profile, currentLocale);
    syncAnchorOffset();
  }

  document.querySelectorAll("[data-locale-switch]").forEach((node) => {
    node.addEventListener("click", () => {
      applyLocale(node.getAttribute("data-locale-switch") || currentLocale);
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey && event.newValue && event.newValue !== currentLocale) {
      applyLocale(event.newValue);
    }
  });

  applyLocale(currentLocale);
  syncAnchorOffset();
  window.addEventListener("resize", syncAnchorOffset, { passive: true });
})();
