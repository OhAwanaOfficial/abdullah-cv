/* ==========================================================================
   CONTENT — the single source of truth.
   The website (index.html), the resume (resume.html) and the CV (cv.html)
   all read from this one file. Edit it, save, refresh — everything updates.
   The GTA IV edition and the Claude edition use the same format, so this
   file can be copied between them.

   Dates use "YYYY-MM" (or "YYYY"); use "present" for current roles.
   Artwork tints: dusk | harbor | park | night | rust | mono
   Artwork scenes: portrait | skyline | bridge | statue | tower | train
   ========================================================================== */

window.PORTFOLIO = {
  person: {
    name: "Abdullah",                       // shown in the logo
    fullName: "Muhammad Abdullah",          // used on the resume/CV
    role: "Full-Stack Developer",
    roles: ["Full-Stack Developer", "BSSE Student", "3D Freelancer"],
    tagline: "I build web apps and AI tools — and ship them live.",
    // Claude edition only (optional): the hero sentence that follows your name,
    // your time zone for the live clock, and a short "currently" list.
    heroLine: "builds full-stack web apps and AI tools — and ships them live.",
    timezone: "Asia/Karachi",
    now: [
      "Final year of BS Software Engineering at The University of Lahore",
      "Taking freelance 3D model work from direct clients",
      "Open to junior developer roles"
    ],
    location: "Lahore, Pakistan",
    email: "ohawanaofficial@gmail.com",
    phone: "+92 326 0778028",
    website: "",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/m-abdullah-awan-520715398", handle: "in/m-abdullah-awan" },
      { label: "GitHub",   url: "https://github.com/OhAwanaOfficial",                   handle: "@OhAwanaOfficial" }
    ],
    // Website portrait: a cut-out PNG (transparent background) that each panel
    // paints in its own colours. Leave empty to use the illustrated character.
    photo: "assets/img/photo.png",
    // Optional plain headshot for the CV header (the stylised portrait isn't used there).
    cvPhoto: "",
    available: true,                        // shows "Open to new missions" / "Available for new work"

    // 2–3 sentences. Used at the top of the resume.
    summary:
      "Final-year Software Engineering student at The University of Lahore and full-stack developer who builds and deploys web apps with Next.js, React, TypeScript and Supabase. " +
      "Freelancing since 2025, delivering 3D models to direct clients, with hands-on SEO experience and five projects live on the web.",

    // Longer bio. Used on the website and in the CV.
    about: [
      "I'm a final-year BS Software Engineering student at The University of Lahore who likes turning ideas into things people can actually use. Most of what I build lives on the web: AI tools, SEO-driven sites and full-stack apps with real sign-in and databases, deployed on Vercel and GitHub Pages.",
      "Alongside my degree I freelance on 3D work, delivering models to clients' specifications. That work led me to build my own tools, like Mesh Studio, which cleans up the messy meshes AI generators produce."
    ],

    // Shown as the character dossier (GTA) and the facts list (Claude edition).
    dossier: [
      ["Occupation", "Full-Stack Developer · BSSE student"],
      ["Base", "Lahore, Pakistan"],
      ["Specialty", "Next.js · TypeScript · Supabase"],
      ["Known for", "Shipping projects live"]
    ]
  },

  // Big numbers on the stats screen.
  numbers: [
    { value: "5",    label: "Projects live on the web" },
    { value: "4",    label: "Programming languages" },
    { value: "2025", label: "Freelancing since" },
    { value: "2027", label: "Graduating" }
  ],

  // Skill bars on the stats screen (0–100). GTA edition only. Self-rated:
  // adjust these to how confident you really feel.
  stats: [
    { label: "Frontend — React / Next.js",    value: 80 },
    { label: "TypeScript / JavaScript",       value: 78 },
    { label: "Backend — Supabase / Clerk",    value: 65 },
    { label: "SEO",                           value: 75 },
    { label: "Python / Java / C++",           value: 62 },
    { label: "3D model cleanup & conversion", value: 70 }
  ],

  // Grouped skills. Used everywhere.
  skills: [
    { group: "Languages",      items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "HTML", "CSS"] },
    { group: "Frameworks",     items: ["React", "Next.js", "Vite"] },
    { group: "Backend & Auth", items: ["Supabase", "Clerk"] },
    { group: "Tools & Other",  items: ["Git & GitHub", "Vercel", "GitHub Pages", "SEO", "AI 3D generators", "Blender (basic)"] }
  ],

  // Newest first. `resumeBullets` = how many bullets the 1-page resume shows (CV shows all).
  experience: [
    {
      role: "Freelance 3D Model Specialist",
      company: "Self-employed",
      location: "Remote",
      start: "2025",
      end: "present",
      bullets: [
        "Deliver 3D models built to each client's brief, finding and managing clients directly through social media.",
        "Generate base models with AI 3D tools, then clean up and convert them into the formats clients need.",
        "Handle the whole job myself: requirements, revisions and final delivery."
      ],
      tech: ["AI 3D generators", "Blender (basic)"],
      resumeBullets: 3
    }
  ],

  // `mission` is the GTA-style name shown on the website; `title` is the real
  // project name used on the resume/CV. `featured: true` puts it on the resume.
  // `image` is optional (a screenshot path); without one, artwork is generated.
  projects: [
    {
      mission: "Word on the Street",
      title: "PostCraft AI — LinkedIn Post Generator",
      year: "2026",
      role: "Solo developer",
      summary: "An AI tool that writes LinkedIn posts for founders, marketers and creators.",
      description: "PostCraft AI generates LinkedIn posts in seconds. I first shipped it as a single-page HTML app, then rebuilt it in Next.js and TypeScript with user accounts through Clerk and a Supabase database.",
      highlights: ["Live on Vercel", "Rebuilt from a static page into a full-stack app with sign-in"],
      tech: ["Next.js", "TypeScript", "Supabase", "Clerk"],
      links: { live: "https://postcraftai-next.vercel.app", code: "https://github.com/OhAwanaOfficial/postcraftai-next" },
      scene: "tower", tint: "dusk", image: "",
      featured: true
    },
    {
      mission: "By the Book",
      title: "APA Citation Generator",
      year: "2026",
      role: "Solo developer",
      summary: "A free, browser-based tool that formats APA citations, built to rank in search.",
      description: "Formats APA references for books, websites and journal articles entirely in the browser, with no backend. Built as an SEO project: separate tool pages and how-to guides target citation keywords, with a sitemap and robots.txt, hosted on GitHub Pages.",
      highlights: ["Formats books, websites and journal articles", "Keyword-targeted guide pages, sitemap and robots.txt"],
      tech: ["JavaScript", "HTML", "CSS", "SEO"],
      links: { live: "https://ohawanaofficial.github.io/apa-generator/", code: "https://github.com/OhAwanaOfficial/apa-generator" },
      scene: "statue", tint: "park", image: "",
      featured: true
    },
    {
      mission: "Patch Job",
      title: "Mesh Studio — 3D Mesh Cleaner",
      year: "2026",
      role: "Solo developer",
      summary: "Fixes the mesh problems in AI-generated 3D models, right in the browser.",
      description: "Drop in an OBJ or FBX file and Mesh Studio previews it in 3D, merges duplicate vertices to clean up the broken geometry AI generators produce, and exports a cleaned OBJ. Everything runs in the browser.",
      highlights: ["Imports OBJ and FBX, exports cleaned OBJ", "Interactive 3D preview"],
      tech: ["Next.js", "TypeScript", "Three.js"],
      links: { live: "https://awan-mesh-studio.vercel.app", code: "https://github.com/OhAwanaOfficial/awan-mesh-studio" },
      scene: "train", tint: "rust", image: "",
      featured: false
    },
    {
      mission: "Paper Trail",
      title: "Awan Agent — AI Compliance Audit",
      year: "2026",
      role: "Solo developer",
      summary: "An AI agent that audits marketing agencies' AI tools for compliance.",
      description: "Awan Agent checks the AI tools a marketing agency uses against GDPR and European regulations such as the EU AI Act. It comes with an SEO-built product site, landing pages and a blog.",
      highlights: ["Covers GDPR and the EU AI Act", "SEO-built site with landing pages and blog"],
      tech: ["HTML", "CSS", "SEO"],
      links: { live: "https://ohawanaofficial.github.io/Awan-Agent/", code: "https://github.com/OhAwanaOfficial/Awan-Agent" },
      scene: "bridge", tint: "harbor", image: "",
      featured: false
    },
    {
      mission: "Copycat",
      title: "3D Replicator",
      year: "2026",
      role: "Solo developer",
      summary: "A tool that recreates 3D models from an existing model.",
      description: "3D Replicator rebuilds a 3D model from a reference model, supporting the conversion work I do for freelance clients.",
      highlights: [],
      tech: [],
      links: { live: "", code: "" },
      scene: "skyline", tint: "night", image: "",
      featured: false
    },
    {
      mission: "Parking Wars",
      title: "Parking Hub",
      year: "2026",
      role: "Solo developer",
      summary: "A web app for finding and booking nearby parking.",
      description: "Parking Hub helps drivers find nearby parking locations and book a spot, built with plain HTML, CSS and JavaScript and hosted on GitHub Pages.",
      highlights: [],
      tech: ["JavaScript", "HTML", "CSS"],
      links: { live: "https://ohawanaofficial.github.io/parking-hub/", code: "https://github.com/OhAwanaOfficial/parking-hub" },
      scene: "portrait", tint: "mono", image: "",
      featured: false
    }
  ],

  education: [
    {
      degree: "BS Software Engineering",
      school: "The University of Lahore",
      location: "Lahore",
      start: "2023",
      end: "2027",
      details: []
    }
  ],

  // Add yours here, e.g. { name: "...", issuer: "...", year: "2025" }.
  // Empty sections are hidden everywhere.
  certifications: [],
  awards: [],
  volunteering: [],

  languages: [
    { name: "Urdu", level: "Native" },
    { name: "English", level: "Professional" }
  ],

  interests: [],

  references: "Available upon request.",

  // Rotating tips on the GTA loading screen.
  tips: [
    "Every panel on the cover is a door. Click one to jump to that section.",
    "Open any mission to read the full briefing.",
    "Use the arrow keys on the phone to scroll through contacts.",
    "The resume and CV are one click away in the top-right corner.",
    "Abdullah is open to junior developer roles and freelance 3D work."
  ]
};
