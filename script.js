// script.js

document.addEventListener("DOMContentLoaded", () => {
    // ===== NAVBAR TOGGLE =====
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // ===== LOAD PROJECT CARDS =====
    fetch("project-images.json")
        .then((response) => response.json())
        .then((projects) => {
            const grid = document.querySelector(".projects-grid");
            grid.innerHTML = ""; // clear any old content

            projects.forEach((project) => {
                const card = document.createElement("div");
                card.classList.add("project-card");

                card.innerHTML = `
                    <img src="assets/project-images/${project.image}" alt="${project.title}">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                `;

                grid.appendChild(card);
            });
        })
        .catch((error) => console.error("Error loading projects:", error));
});
