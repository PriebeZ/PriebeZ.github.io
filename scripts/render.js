function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function setText(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text ?? "";
}

function safeUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url, window.location.href);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

function renderIcon(src, className) {
  const icon = el("span", className);
  if (src) {
    const img = el("img");
    img.src = src;
    img.alt = "";
    icon.appendChild(img);
  }
  return icon;
}

function renderNav(container, nav) {
  if (!container) return;
  container.innerHTML = "";
  (nav || []).forEach((item) => {
    const a = el("a", item?.active ? "sideItem active" : "sideItem");
    a.href = item?.href || "#";
    a.append(renderIcon(item?.icon, "icon"), document.createTextNode(item?.label || ""));
    container.appendChild(a);
  });
}

function renderLinks(container, links) {
  container.innerHTML = "";
  (links || [])
    .map((x) => ({ label: x?.label, url: safeUrl(x?.url) }))
    .filter((x) => x.label && x.url)
    .forEach((x) => {
      const a = el("a", "chip");
      a.textContent = x.label;
      a.href = x.url;
      a.target = "_blank";
      a.rel = "noreferrer noopener";
      container.appendChild(a);
    });
}

function renderMetrics(container, profile) {
  container.innerHTML = "";
  (profile?.metrics || []).slice(0, 3).forEach((m) => {
    const card = el("article", "metricCard");
    const icon = el("div", "metricIcon");
    if (m?.icon) icon.appendChild(renderIcon(m.icon, "metricIconInner"));

    const body = el("div");
    const label = el("div", "metricLabel");
    label.textContent = m?.label || "";
    const value = el("div", "metricValue");
    value.textContent = m?.value ?? "";
    const hint = el("div", "metricHint");
    hint.textContent = m?.hint || "";

    body.append(label, value, hint);
    card.append(icon, body);
    container.appendChild(card);
  });
}

function renderContact(container, contact) {
  container.innerHTML = "";
  (contact || [])
    .filter((x) => x?.key && x?.value)
    .forEach((x) => {
      const item = el("div", "kvItem");
      const k = el("div", "kvKey");
      k.textContent = x.key;
      const v = el("div", "kvVal");
      v.textContent = x.value;
      item.append(k, v);
      container.appendChild(item);
    });
}

function renderList(items) {
  const ul = el("ul", "bulletList");
  (items || []).filter(Boolean).forEach((item) => {
    const li = el("li");
    li.textContent = item;
    ul.appendChild(li);
  });
  return ul;
}

function renderExperience(container, experiences) {
  if (!container) return;
  container.innerHTML = "";

  (experiences || []).forEach((x) => {
    const item = el("article", "timelineItem");
    const head = el("div", "timelineHead");
    const title = el("h3");
    title.textContent = x?.company || "";
    const period = el("span", "badge");
    period.textContent = x?.period || "";
    head.append(title, period);

    const role = el("p", "projectDesc");
    role.textContent = [x?.role, x?.summary].filter(Boolean).join(" · ");

    item.append(head);
    if (role.textContent) item.appendChild(role);
    if (x?.bullets?.length) item.appendChild(renderList(x.bullets));
    container.appendChild(item);
  });
}

function renderProjectGrid(container, projects) {
  container.innerHTML = "";

  (projects || []).forEach((p) => {
    const card = el("article", "project");

    const titleRow = el("div", "projectTitle");
    const titleLeft = el("div", "projectTitleMain");
    const icon = renderIcon(p?.icon, "projectIcon");
    const h3 = el("h3");
    h3.textContent = p?.title || "未命名项目";
    titleLeft.append(icon, h3);

    const badge = el("span", "badge");
    badge.textContent = p?.period || p?.status || "";
    titleRow.appendChild(titleLeft);
    if (badge.textContent) titleRow.appendChild(badge);

    const desc = el("p", "projectDesc");
    desc.textContent = [p?.subtitle, p?.description].filter(Boolean).join(" · ");

    const meta = el("div", "projectMeta");
    (p?.tags || []).filter(Boolean).slice(0, 8).forEach((t) => {
      const tag = el("span", "tag");
      tag.textContent = String(t);
      meta.appendChild(tag);
    });

    const linkRow = el("div", "projectMeta");
    (p?.links || [])
      .map((x) => ({ label: x?.label, url: safeUrl(x?.url) }))
      .filter((x) => x.label && x.url)
      .slice(0, 2)
      .forEach((x) => {
        const a = el("a", "chip");
        a.textContent = x.label;
        a.href = x.url;
        a.target = "_blank";
        a.rel = "noreferrer noopener";
        linkRow.appendChild(a);
      });

    card.appendChild(titleRow);
    if (desc.textContent) card.appendChild(desc);
    if (p?.bullets?.length) card.appendChild(renderList(p.bullets));
    if (meta.childNodes.length) card.appendChild(meta);
    if (linkRow.childNodes.length) card.appendChild(linkRow);
    container.appendChild(card);
  });
}

function renderSkills(container, skills) {
  container.innerHTML = "";
  (skills || []).slice(0, 8).forEach((s) => {
    const value = Math.max(0, Math.min(100, Number(s?.level || 0)));
    const item = el("div", "skillItem");
    const top = el("div", "skillTop");
    const name = el("span");
    name.textContent = s?.name || "Skill";
    const percent = el("span");
    percent.textContent = `${value}%`;
    const bar = el("div", "progress");
    const fill = el("span");
    fill.style.setProperty("--w", `${value}%`);

    top.append(name, percent);
    bar.appendChild(fill);
    item.append(top, bar);
    container.appendChild(item);
  });
}

function renderTextDetails(container, items) {
  if (!container) return;
  container.innerHTML = "";
  if (items?.length) container.appendChild(renderList(items));
}

function renderEducation(container, items) {
  if (!container) return;
  container.innerHTML = "";
  (items || []).forEach((x) => {
    const card = el("article", "simpleCard");
    const title = el("h3");
    title.textContent = x?.title || "";
    const desc = el("p", "projectDesc");
    desc.textContent = [x?.subtitle, x?.period].filter(Boolean).join(" · ");
    card.appendChild(title);
    if (desc.textContent) card.appendChild(desc);
    container.appendChild(card);
  });
}

function getLocalizedProfile(profile, locale) {
  const locales = profile?.locales || null;
  if (!locales) {
    return {
      locale: locale || "zh-CN",
      data: profile || {},
    };
  }

  const defaultLocale = profile?.defaultLocale || "zh-CN";
  const availableLocales = Object.keys(locales);
  if (!locale || locale === defaultLocale) {
    return {
      locale: defaultLocale,
      data: profile || {},
    };
  }

  if (locales[locale]) {
    return {
      locale,
      data: locales[locale],
    };
  }

  if (locales[defaultLocale]) {
    return {
      locale: defaultLocale,
      data: locales[defaultLocale],
    };
  }

  return {
    locale: availableLocales[0] || defaultLocale,
    data: locales[availableLocales[0]] || profile || {},
  };
}

function syncLocaleSwitcher(locale) {
  document.querySelectorAll("[data-locale-switch]").forEach((node) => {
    const active = node.getAttribute("data-locale-switch") === locale;
    node.classList.toggle("active", active);
    node.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderProfile(profile, locale) {
  const localized = getLocalizedProfile(profile, locale);
  const ui = localized.data?.uiText || {};
  const content = localized.data || {};

  document.documentElement.lang = localized.locale || "zh-CN";
  document.title = ui.pageTitle || document.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", ui.metaDescription || "");

  setText("sidebarLabel", ui.sidebarLabel || "");
  setText("name", profile?.name || "黄力其");
  setText("headline", content?.headline || profile?.headline || "");
  setText("bio", content?.bio || profile?.bio || "");
  setText("topEyebrow", ui.topEyebrow || "");
  setText("topTitle", ui.topTitle || "");
  setText("topPill", ui.topPill || "");
  setText("bioTitle", ui.bioTitle || "");
  setText("experienceTitle", ui.experienceTitle || "");
  setText("experienceSubtitle", ui.experienceSubtitle || "");
  setText("projectsTitle", ui.projectsTitle || "");
  setText("projectsSubtitle", ui.projectsSubtitle || "");
  setText("skillsTitle", ui.skillsTitle || "");
  setText("skillsSubtitle", ui.skillsSubtitle || "");
  setText("educationTitle", ui.educationTitle || "");
  setText("educationSubtitle", ui.educationSubtitle || "");
  setText("contactEyebrow", ui.contactEyebrow || "");
  setText("contactTitle", ui.contactTitle || "");

  renderNav(document.getElementById("sideNav"), content?.nav || profile?.nav);

  const links = document.getElementById("links");
  if (links) renderLinks(links, content?.links || profile?.links);

  const metrics = document.getElementById("metricGrid");
  if (metrics) renderMetrics(metrics, content);

  renderExperience(document.getElementById("experienceList"), content?.experiences);

  const contactKv = document.getElementById("contactKv");
  if (contactKv) renderContact(contactKv, content?.contact);

  const grid = document.getElementById("projectGrid");
  if (grid) renderProjectGrid(grid, content?.projects);

  const skillList = document.getElementById("skillList");
  if (skillList) renderSkills(skillList, content?.skills);

  renderTextDetails(document.getElementById("skillDetails"), content?.skillDetails);
  renderEducation(document.getElementById("educationList"), content?.education);
  syncLocaleSwitcher(localized.locale || "zh-CN");

  const year = String(new Date().getFullYear());
  const footer = String(ui.footerTemplate || "").replace("{year}", year);
  setText("footerText", footer || `© ${year}`);
}

window.renderProfile = renderProfile;
