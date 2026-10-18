/* ==========================================================================
   Renders the resume (1 page, highlights only) or the CV (everything) from
   content.js, depending on <body data-doc="resume|cv">.
   ========================================================================== */
(function () {
  "use strict";

  const D = window.PORTFOLIO, U = window.Util, P = D.person, esc = U.esc;
  const isCV = document.body.dataset.doc === "cv";
  const name = P.fullName || P.name;
  document.title = `${name} — ${isCV ? "CV" : "Resume"}`;

  const link = (url, text) => `<a href="${esc(url)}">${esc(text || U.prettyUrl(url))}</a>`;
  const list = (items) => (items && items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");
  const section = (title, body) => (body ? `<section class="sec"><h2>${esc(title)}</h2>${body}</section>` : "");
  const row = (title, when) => `<div class="row"><h3>${title}</h3>${when ? `<span class="when">${esc(when)}</span>` : ""}</div>`;
  const sentence = (s) => (s && !/[.!?]$/.test(s) ? s + "." : s || "");

  /* ---------- header ---------- */

  const contact = [
    P.location && `<span class="nw">${esc(P.location)}</span>`,
    P.email && link("mailto:" + P.email, P.email),
    P.phone && link("tel:" + P.phone.replace(/[^\d+]/g, ""), P.phone)
  ].concat((P.links || []).map((l) => link(l.url)))
    .concat([P.website && link(P.website)])
    .filter(Boolean);

  let html = `<header class="doc-head">
      <div class="doc-head-text">
        <h1>${esc(name)}</h1>
        <p class="role">${esc(P.role)}</p>
        <p class="contact">${contact.join(' <span class="sep" aria-hidden="true">|</span> ')}</p>
      </div>
      ${isCV && P.cvPhoto ? `<img class="photo" src="${esc(P.cvPhoto)}" alt="Photo of ${esc(name)}">` : ""}
    </header>`;

  /* ---------- summary / profile ---------- */

  html += isCV
    ? section("Profile", (P.about && P.about.length ? P.about : [P.summary]).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join(""))
    : section("Summary", P.summary ? `<p>${esc(P.summary)}</p>` : "");

  /* ---------- experience ---------- */

  const experience = (D.experience || []).map((e) => `
    <article class="entry">
      ${row(esc(e.role), U.fmtRange(e.start, e.end))}
      <p class="sub"><b>${esc(e.company)}</b>${e.location ? ` · ${esc(e.location)}` : ""}</p>
      ${list(isCV ? e.bullets : (e.bullets || []).slice(0, e.resumeBullets || 3))}
      ${isCV && e.tech && e.tech.length ? `<p class="tech"><b>Tools:</b> ${esc(e.tech.join(", "))}</p>` : ""}
    </article>`).join("");
  html += section(isCV ? "Professional Experience" : "Experience", experience);

  /* ---------- projects ---------- */

  const projects = (isCV ? D.projects || [] : (D.projects || []).filter((p) => p.featured).slice(0, 3)).map((p) => {
    const links = p.links || {};
    const urls = [links.live && link(links.live), links.code && link(links.code)].filter(Boolean).join(" · ");
    if (!isCV) {
      const text = [sentence(p.summary)].concat((p.highlights || []).map(sentence)).join(" ");
      return `<article class="entry">
        ${row(`${esc(p.title)}${(p.tech || []).length ? ` <span class="at">| ${esc(p.tech.join(", "))}</span>` : ""}`, p.year)}
        <p class="desc">${esc(text)}</p>
      </article>`;
    }
    return `<article class="entry">
      ${row(esc(p.title), p.year)}
      ${p.role ? `<p class="sub">${esc(p.role)}</p>` : ""}
      <p class="desc">${esc(p.description || p.summary)}</p>
      ${list(p.highlights)}
      ${(p.tech || []).length || urls ? `<p class="tech">${[(p.tech || []).length ? `<b>Tech:</b> ${esc(p.tech.join(", "))}` : "", urls].filter(Boolean).join(` <span class="sep">·</span> `)}</p>` : ""}
    </article>`;
  }).join("");
  html += section(isCV ? "Selected Projects" : "Projects", projects);

  /* ---------- skills ---------- */

  const skills = (D.skills || []).length
    ? `<dl class="skills">${D.skills.map((g) => `<div><dt>${esc(g.group)}</dt><dd>${esc(g.items.join(", "))}</dd></div>`).join("")}</dl>`
    : "";
  html += section(isCV ? "Skills" : "Skills", skills);

  /* ---------- education ---------- */

  const education = (D.education || []).map((e) => `
    <article class="entry">
      ${row(esc(e.degree), U.fmtRange(e.start, e.end))}
      <p class="sub"><b>${esc(e.school)}</b>${e.location ? ` · ${esc(e.location)}` : ""}</p>
      ${isCV ? list(e.details) : e.details && e.details[0] ? `<p class="desc">${esc(e.details[0])}</p>` : ""}
    </article>`).join("");
  html += section("Education", education);

  /* ---------- certifications & awards ---------- */

  const lines = (items) => (items.length ? `<ul class="lines">${items.join("")}</ul>` : "");
  const certs = (D.certifications || []).map((c) => `<li><div><b>${esc(c.name)}</b>${c.issuer ? ` <span>— ${esc(c.issuer)}</span>` : ""}</div><span class="when">${esc(c.year)}</span></li>`);
  const awards = (D.awards || []).map((a) => `<li><div><b>${esc(a.name)}</b>${a.detail ? ` <span>— ${esc(a.detail)}</span>` : ""}</div><span class="when">${esc(a.year)}</span></li>`);

  if (isCV) {
    html += section("Certifications", lines(certs));
    html += section("Awards & Achievements", lines(awards));

    const volunteering = (D.volunteering || []).map((v) => `
      <article class="entry">
        ${row(esc(v.role), U.fmtRange(v.start, v.end))}
        <p class="sub"><b>${esc(v.org)}</b></p>
        ${v.detail ? `<p class="desc">${esc(v.detail)}</p>` : ""}
      </article>`).join("");
    html += section("Volunteering", volunteering);

    const languages = (D.languages || []).map((l) => `${esc(l.name)} <span class="at">(${esc(l.level)})</span>`).join(' <span class="sep">·</span> ');
    html += section("Languages", languages ? `<p>${languages}</p>` : "");
    html += section("Interests", (D.interests || []).length ? `<p>${esc(D.interests.join(" · "))}</p>` : "");
    html += section("References", D.references ? `<p>${esc(D.references)}</p>` : "");
  } else {
    html += section("Certifications & Awards", lines(certs.concat(awards)));
  }

  document.getElementById("doc").innerHTML = html;

  const printBtn = document.getElementById("print");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
})();
