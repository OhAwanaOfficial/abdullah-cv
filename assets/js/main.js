/* ==========================================================================
   Website behaviour: renders content.js into the page, paints the artwork,
   runs the loading screen, pause-menu scrollspy, mission briefings and phone.
   ========================================================================== */
(function () {
  "use strict";

  const D = window.PORTFOLIO, S = window.Scenes, U = window.Util;
  const P = D.person;
  const esc = U.esc;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, "0");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ACCENT = { dusk: "#efa04a", harbor: "#5f97a3", park: "#a9a764", night: "#b05a79", rust: "#db8d6a", mono: "#b8ae9a" };

  const ICON = (() => {
    const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    return {
      email: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
      phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
      linkedin: svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'),
      github: svg('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5.1 5.1 0 0 0 19.9 1S18.7.7 16 2.5a13.4 13.4 0 0 0-7 0C6.3.7 5.1 1 5.1 1A5.1 5.1 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.3 6.6 6.4 7A3.4 3.4 0 0 0 9 18.1V22"/>'),
      web: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'),
      doc: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>'),
      trophy: svg('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'),
      badge: svg('<circle cx="12" cy="8" r="6"/><path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8"/>')
    };
  })();

  /* ---------- artwork ---------- */

  document.body.insertAdjacentHTML("afterbegin", S.filterDefs());

  function paint(el, extra) {
    const o = Object.assign({
      subject: el.dataset.scene || "skyline",
      tint: el.dataset.tint || "dusk",
      seed: +el.dataset.seed || 1,
      ratio: el.dataset.ratio || "wide",
      image: el.dataset.image || ""
    }, extra);
    const photo = o.image || (o.subject === "portrait" ? P.photo : "");
    let html = '<div class="art">' + S.scene(Object.assign({}, o, { figure: !photo }));
    if (photo) html += `<img src="${esc(photo)}" alt="" style="filter:url(#ink-${esc(o.tint)})">`;
    el.insertAdjacentHTML("afterbegin", html + "</div>");
  }

  /* ---------- simple bindings ---------- */

  const displayName = P.fullName || P.name;
  $$("[data-bind]").forEach((el) => { const v = P[el.dataset.bind]; if (v) el.textContent = v; });
  $$("[data-bind-download]").forEach((a) => a.setAttribute("download", `${displayName.replace(/\s+/g, "-")}-${a.dataset.bindDownload}.pdf`));
  document.title = `${displayName} — ${P.role}`;
  $("#logo-roles").innerHTML = (P.roles || [P.role]).map((r) => `<span>${esc(r)}</span>`).join("");
  $("#year").textContent = new Date().getFullYear();

  /* ---------- 01 brief ---------- */

  $("#brief-about").innerHTML = (P.about || []).map((p) => `<p>${esc(p)}</p>`).join("");
  $("#dossier").innerHTML = [["Name", displayName]].concat(P.dossier || [])
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  if (P.available) $("#brief-status").textContent = "Open to new missions";

  /* ---------- 02 stats ---------- */

  $("#numbers").innerHTML = (D.numbers || []).map((n) => `<div class="number"><b>${esc(n.value)}</b><span>${esc(n.label)}</span></div>`).join("");
  $("#bars").innerHTML = (D.stats || []).map((s) => `
    <li>
      <div class="bar-top"><span>${esc(s.label)}</span><b>${+s.value}%</b></div>
      <div class="bar-track" role="progressbar" aria-label="${esc(s.label)}" aria-valuenow="${+s.value}" aria-valuemin="0" aria-valuemax="100">
        <div class="bar-fill" style="--v:${+s.value}"></div>
      </div>
    </li>`).join("");
  $("#arsenal").innerHTML = (D.skills || []).map((g) => `
    <div class="arsenal-group">
      <h4>${esc(g.group)}</h4>
      <ul class="tags">${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`).join("");

  /* ---------- 03 missions ---------- */

  const missionList = $("#mission-list");
  missionList.innerHTML = (D.projects || []).map((p, i) => `
    <article class="mission reveal" style="--d:${(i % 3) * 90}ms">
      <div class="panel mission-art" data-scene="${esc(p.scene || "skyline")}" data-tint="${esc(p.tint || "dusk")}" data-seed="${20 + i}" data-image="${esc(p.image || "")}"></div>
      <div class="mission-body">
        <span class="mission-meta">Mission ${pad(i + 1)} · ${esc(p.year)}</span>
        <h3 class="mission-title"><button class="mission-open" type="button" data-i="${i}" aria-haspopup="dialog">${esc(p.mission || p.title)}</button></h3>
        <p class="mission-real">${esc(p.title)}</p>
        <p class="mission-sum">${esc(p.summary)}</p>
        <ul class="tags">${(p.tech || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
      <span class="stamp" aria-hidden="true">Mission passed</span>
    </article>`).join("");

  const dialog = $("#briefing");
  function openBriefing(i) {
    const p = D.projects[i];
    const art = $("#briefing-art");
    art.innerHTML = "";
    paint(art, { subject: p.scene || "skyline", tint: p.tint || "dusk", seed: 20 + i, ratio: "tall", image: p.image || "" });
    $("#briefing-meta").textContent = [`Mission ${pad(i + 1)}`, p.year, p.role].filter(Boolean).join(" · ");
    $("#briefing-title").textContent = p.mission || p.title;
    $("#briefing-real").textContent = p.title;
    $("#briefing-desc").textContent = p.description || p.summary || "";
    $("#briefing-list").innerHTML = (p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join("");
    $("#briefing-tags").innerHTML = (p.tech || []).map((t) => `<li>${esc(t)}</li>`).join("");
    const links = p.links || {};
    $("#briefing-links").innerHTML =
      (links.live ? `<a class="btn" href="${esc(links.live)}" target="_blank" rel="noopener">Live site ↗</a>` : "") +
      (links.code ? `<a class="btn btn-ghost" href="${esc(links.code)}" target="_blank" rel="noopener">Source code ↗</a>` : "");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }
  function closeBriefing() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  missionList.addEventListener("click", (e) => {
    const btn = e.target.closest(".mission-open");
    if (btn) openBriefing(+btn.dataset.i);
  });
  $("#briefing-close").addEventListener("click", closeBriefing);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeBriefing(); });

  /* ---------- 04 story ---------- */

  const tints = ["dusk", "harbor", "rust", "park", "night"];
  const edu = D.education || [], jobs = D.experience || [];
  const chapters = jobs.map((e, i) => ({
    num: jobs.length - i + edu.length,
    title: e.role,
    where: [e.company, e.location].filter(Boolean).join(" · "),
    dates: U.fmtRange(e.start, e.end),
    bullets: e.bullets || [],
    tags: e.tech || []
  })).concat(edu.map((e, i) => ({
    num: edu.length - i,
    label: "Origin story",
    title: e.degree,
    where: [e.school, e.location].filter(Boolean).join(" · "),
    dates: U.fmtRange(e.start, e.end),
    bullets: e.details || [],
    tags: []
  })));
  $("#story-list").innerHTML = chapters.map((c, i) => `
    <li class="chapter reveal" style="--accent:${ACCENT[tints[i % tints.length]]}">
      <div class="chapter-tag"><small>${esc(c.label || "Chapter")}</small><b>${pad(c.num)}</b><span>${esc(c.dates)}</span></div>
      <div class="chapter-card">
        <h3>${esc(c.title)}</h3>
        <p class="chapter-where">${esc(c.where)}</p>
        ${c.bullets.length ? `<ul>${c.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
        ${c.tags.length ? `<ul class="tags">${c.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      </div>
    </li>`).join("");

  const achievements = (D.certifications || []).map((c) => ({ icon: "badge", name: c.name, detail: [c.issuer, c.year].filter(Boolean).join(" · ") }))
    .concat((D.awards || []).map((a) => ({ icon: "trophy", name: a.name, detail: [a.detail, a.year].filter(Boolean).join(" · ") })));
  if (achievements.length) {
    $("#achievements").innerHTML = achievements.map((a) => `<li>${ICON[a.icon]}<div><b>${esc(a.name)}</b><span>${esc(a.detail)}</span></div></li>`).join("");
  } else {
    $(".achievements").remove();
  }

  /* ---------- 05 phone ---------- */

  const contacts = [
    P.email && { label: "Email", value: P.email, href: `mailto:${P.email}`, icon: "email" },
    P.phone && { label: "Phone", value: P.phone, href: `tel:${P.phone.replace(/[^\d+]/g, "")}`, icon: "phone" }
  ].concat((P.links || []).map((l) => ({
    label: l.label, value: l.handle || U.prettyUrl(l.url), href: l.url, icon: ICON[l.label.toLowerCase()] ? l.label.toLowerCase() : "web"
  }))).concat([
    P.website && { label: "Website", value: U.prettyUrl(P.website), href: P.website, icon: "web" }
  ]).filter(Boolean);

  const external = (href) => /^https?:/i.test(href);
  $("#contact-list").innerHTML = contacts.map((c) => `
    <li><a href="${esc(c.href)}"${external(c.href) ? ' target="_blank" rel="noopener"' : ""}>${ICON[c.icon]}<span><small>${esc(c.label)}</small>${esc(c.value)}</span></a></li>`).join("");

  const phoneItems = contacts.concat([
    { label: "Resume", value: "One-page resume", href: "resume.html", icon: "doc", local: true },
    { label: "Full CV", value: "Curriculum vitae", href: "cv.html", icon: "doc", local: true }
  ]);
  const screen = $(".phone-screen"), phoneList = $("#phone-list"), calling = $("#phone-calling");
  let selected = 0, callTimer = 0;

  phoneList.innerHTML = phoneItems.map((c, i) => `<li role="option" id="pc-${i}" data-i="${i}" aria-selected="${i === 0}">${ICON[c.icon]}<span>${esc(c.label)}</span></li>`).join("");
  screen.setAttribute("aria-activedescendant", "pc-0");

  function select(i) {
    selected = (i + phoneItems.length) % phoneItems.length;
    $$("li", phoneList).forEach((li, j) => li.setAttribute("aria-selected", String(j === selected)));
    screen.setAttribute("aria-activedescendant", "pc-" + selected);
    // keep the highlighted row inside the little screen without scrolling the page
    const li = phoneList.children[selected];
    if (li.offsetTop < phoneList.scrollTop) phoneList.scrollTop = li.offsetTop;
    else if (li.offsetTop + li.offsetHeight > phoneList.scrollTop + phoneList.clientHeight) {
      phoneList.scrollTop = li.offsetTop + li.offsetHeight - phoneList.clientHeight;
    }
  }
  function hangUp() { calling.classList.remove("on"); }
  function call(i) {
    const c = phoneItems[i];
    calling.innerHTML = `<span class="ring">${ICON.phone}</span><b>${c.local ? "Opening" : "Calling"}</b><span>${esc(c.label)}</span><small>${esc(c.value)}</small>`;
    calling.classList.add("on");
    clearTimeout(callTimer);
    if (c.local) {
      callTimer = setTimeout(() => { location.href = c.href; }, 650);
    } else {
      if (external(c.href)) window.open(c.href, "_blank", "noopener");
      else location.href = c.href;
      callTimer = setTimeout(hangUp, 2400);
    }
  }
  function press(key) {
    if (key === "up") select(selected - 1);
    else if (key === "down") select(selected + 1);
    else if (key === "ok") call(selected);
    else if (key === "back") hangUp();
  }

  phoneList.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li) { select(+li.dataset.i); call(+li.dataset.i); }
  });
  phoneList.addEventListener("mousemove", (e) => {
    const li = e.target.closest("li");
    if (li && +li.dataset.i !== selected) select(+li.dataset.i);
  });
  $$(".phone-keys [data-key]").forEach((b) => b.addEventListener("click", () => press(b.dataset.key)));
  screen.addEventListener("keydown", (e) => {
    const map = { ArrowUp: "up", ArrowLeft: "up", ArrowDown: "down", ArrowRight: "down", Enter: "ok", " ": "ok", Escape: "back", Backspace: "back" };
    if (map[e.key]) { e.preventDefault(); press(map[e.key]); }
  });

  const clock = $("#phone-clock");
  const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
  tick();
  setInterval(tick, 20000);

  /* ---------- paint every artwork slot ---------- */

  $$("[data-scene]").forEach((el) => paint(el));

  /* ---------- loading screen ---------- */

  const root = document.documentElement, loader = $("#loader");
  if (!loader || root.classList.contains("skip-loader")) {
    root.classList.remove("is-loading");
    if (loader) loader.remove();
  } else {
    const tips = D.tips && D.tips.length ? D.tips : [""];
    const tipEl = $("#loader-tip");
    let tip = 0;
    tipEl.textContent = tips[0];
    const tipTimer = setInterval(() => { tip = (tip + 1) % tips.length; tipEl.textContent = tips[tip]; }, 1700);
    const finish = () => {
      if (loader.classList.contains("done")) return;
      loader.classList.add("done");
      root.classList.remove("is-loading");
      clearInterval(tipTimer);
      try { sessionStorage.setItem("seenLoader", "1"); } catch (e) { /* storage unavailable */ }
      setTimeout(() => loader.remove(), 800);
    };
    setTimeout(finish, reduceMotion ? 900 : 3800);
    loader.addEventListener("click", finish);
    window.addEventListener("keydown", finish, { once: true });
  }

  /* ---------- pause-menu scrollspy ---------- */

  const tabs = $$(".menu-tabs a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "brief", "stats", "missions", "story", "phone"].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        reveal.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    $$(".reveal").forEach((el) => reveal.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }
})();
