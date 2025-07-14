// script.js - Portfolio Filtering & Modal

// Project data
const projects = [
  {
    title: "❤️ Love Language Explorer",
    emoji: "❤️",
    url: "https://utsavkth.github.io/Discover-Your-Love-Language/",
    category: ["web", "psychology"],
    desc: "Interactive web app to discover primary love languages. Built with vanilla JS and custom UI/UX logic."
  },
  {
    title: "🧠 Attachment Style Profiler",
    emoji: "🧠",
    url: "https://utsavkth.github.io/Discover-Your-Attachment-Style/",
    category: ["web", "psychology"],
    desc: "Browser-based tool to assess attachment styles using emotional pattern recognition and dynamic result rendering."
  },
  {
    title: "🔥 Temperament Insight Tool",
    emoji: "🔥",
    url: "https://utsavkth.github.io/Discover-Your-Sexual-Temperament/",
    category: ["web", "psychology"],
    desc: "SIS/SES-based temperament quiz — blending psychological theory with mobile-friendly design and logic."
  },
  {
    title: "🎨 True Colour Personality Quiz",
    emoji: "🎨",
    url: "https://utsavkth.github.io/I-See-Your-True-Colour/",
    category: ["web", "psychology"],
    desc: "Color-based preference tool with chart visualization and scoring logic — built with Tailwind + Chart.js."
  },
  {
    title: "🧰 Student Resource Hub",
    emoji: "📚",
    url: "https://utsavkhatiwada.notion.site/Utsav-Khatiwada-Student-Study-Dashboard-35432cd1c734420aa06f2d78569d0cce",
    category: ["notion"],
    desc: "Notion-based academic productivity dashboard. Includes notes, templates, and tech study workflows."
  },
  {
    title: "🛡️ Raspberry Pi Ad Blocker",
    emoji: "🛡️",
    url: "https://utsavkhatiwada.notion.site/Pi-hole-Ad-Blocker-Setup-Guide-bf8ab264ad274b0a92e4cb9b16c4077b",
    category: ["iot"],
    desc: "Network-wide ad blocking system using Pi-hole + Raspberry Pi. Benchmarked performance and LAN privacy."
  },
  {
    title: "📦 CDN Media Server",
    emoji: "📦",
    url: "https://utsavkhatiwada.notion.site/CDN-Media-Server-on-Raspberry-Pi-b5be6a5b0d504af4b7192d23f1cb8c0f",
    category: ["iot"],
    desc: "Final year project — Dockerized media CDN on Raspberry Pi for offline streaming using LAN tools."
  },
  {
    title: "🔬 Pathology Middleware",
    emoji: "🔬",
    url: "https://utsavkhatiwada.notion.site/Digital-Pathology-Middleware-Project-Intro-Workflow-1c0144bf7aa38082b349ffb48297bc8a",
    category: ["iot", "infra"],
    desc: "Developed during internship at Interfuse — HL7 simulation with Raspberry Pi & shell scripting for radiology devices."
  }
];

// DOM references
const projectGrid = document.getElementById("projectGrid");
const searchBox = document.getElementById("searchBox");

// Render all projects
function renderProjects(filter = "all") {
  const term = searchBox.value.toLowerCase();
  projectGrid.innerHTML = "";

  const filtered = projects.filter((project) => {
    const matchesCategory =
      filter === "all" || project.category.includes(filter);
    const matchesSearch =
      project.title.toLowerCase().includes(term) ||
      project.desc.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    projectGrid.innerHTML = "<p class='no-results'>No matching projects found.</p>";
    return;
  }

  filtered.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-header">${project.emoji} ${project.title}</div>
      <p>${project.desc}</p>
      <a href="${project.url}" target="_blank">🔗 View Project</a>
    `;
    projectGrid.appendChild(card);
  });
}

// Search & filter functions
function filterProjects(category) {
  renderProjects(category);
}

searchBox.addEventListener("input", () => renderProjects("all"));

// Dark mode toggle
const toggle = document.getElementById("darkToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Initial load
renderProjects();
