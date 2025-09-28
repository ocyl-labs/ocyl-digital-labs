const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        navMenu.classList.remove('active');
    });
});

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        const grid = document.getElementById('projects-grid');
        grid.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="${project.image || 'https://source.unsplash.com/300x200/?ai,abstract'}" alt="${project.name}">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <p>Progress: ${project.progress}% - ${project.status}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = `
            <div class="project-card">
                <img src="https://source.unsplash.com/300x200/?ai,tech" alt="Sample">
                <h3>Sample AI Tool</h3>
                <p>High-tech adaptive learning app.</p>
                <div class="progress-bar"><div class="progress-fill" style="width: 95%"></div></div>
                <p>Progress: 95% - Final Completion</p>
            </div>
        `;
    }
}

document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! We\'ll respond soon.');
    e.target.reset();
});

document.addEventListener('DOMContentLoaded', loadProjects);
