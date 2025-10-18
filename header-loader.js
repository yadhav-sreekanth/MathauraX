// header-loader.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;
            document.body.prepend(tempDiv.firstElementChild);

            // Optional: Initialize any JS related to the header
            initHeaderJS();
        })
        .catch(err => console.error("Failed to load header:", err));
});

function initHeaderJS() {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsDropdown = document.getElementById('settingsDropdown');

    if (settingsIcon && settingsDropdown) {
        settingsIcon.addEventListener('click', () => {
            settingsDropdown.classList.toggle('show');
        });
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
}
