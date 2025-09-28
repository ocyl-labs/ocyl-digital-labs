// Toggle mobile menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// Load project cards from JSON
async function loadProjects() {
  try {
    const response = await fetch("project-images.json");
    const projects = await response.json();
    const grid = document.getElementById("projects-grid");

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <img src="assets/project-images/${project.image}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${project.progress}%;"></div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading projects:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
