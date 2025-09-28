// script.js

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
});

// Load project images + titles from JSON and render cards
async function loadProjects() {
  try {
    const resp = await fetch("project-images.json");
    if (!resp.ok) {
      console.error("Failed to fetch project-images.json:", resp.status, resp.statusText);
      return;
    }
    const projects = await resp.json();
    const grid = document.querySelector(".projects-grid");
    if (!grid) {
      console.error("No element with class .projects-grid found in HTML");
      return;
    }

    Object.entries(projects).forEach(([title, imgPath]) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = title;
      img.onerror = () => {
        console.warn("Image failed to load:", imgPath);
      };

      const h3 = document.createElement("h3");
      h3.textContent = title;

      const p = document.createElement("p");
      p.textContent = title;  // or replace with a description if you have one

      card.appendChild(img);
      card.appendChild(h3);
      card.appendChild(p);

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Error in loadProjects:", err);
  }
}
