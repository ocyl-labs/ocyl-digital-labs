async function loadProjects() {
  const response = await fetch("assets/projects.json");
  const projects = await response.json();

  const container = document.getElementById("projects");
  for (const [name, url] of Object.entries(projects)) {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="card-img" style="background-image: url(${url});"></div>
      <h3>${name}</h3>
    `;
    container.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
