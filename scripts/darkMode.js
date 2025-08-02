// Shared Dark Mode System for MathauraX
// This file handles dark mode functionality across all pages

class DarkModeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        this.init();
    }

    init() {
        // Apply dark mode on page load
        if (this.isDarkMode) {
            this.enableDarkMode();
        }

        // Add dark mode toggle button to all pages
        this.addDarkModeToggle();
    }

    enableDarkMode() {
        document.body.classList.add('dark-mode');
        this.isDarkMode = true;
        localStorage.setItem('darkMode', 'enabled');
        this.updateToggleButton();
    }

    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        this.isDarkMode = false;
        localStorage.setItem('darkMode', 'disabled');
        this.updateToggleButton();
    }

    toggleDarkMode() {
        if (this.isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    addDarkModeToggle() {
        // Find existing settings dropdown or create one
        let settingsDropdown = document.getElementById('settingsDropdown');
        
        if (!settingsDropdown) {
            // Create settings menu if it doesn't exist
            this.createSettingsMenu();
        } else {
            // Add dark mode toggle to existing dropdown
            this.addToggleToExistingDropdown();
        }
    }

    createSettingsMenu() {
        // Create settings icon
        const settingsIcon = document.createElement('i');
        settingsIcon.className = 'fas fa-cog';
        settingsIcon.id = 'settingsIcon';
        settingsIcon.style.cssText = 'cursor: pointer; font-size: 1.4rem; color: #000; padding: 0.5rem; transition: transform 0.3s ease;';
        
        // Create settings dropdown
        const settingsDropdown = document.createElement('ul');
        settingsDropdown.id = 'settingsDropdown';
        settingsDropdown.className = 'settings-dropdown';
        settingsDropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 0.5em 0;
            min-width: 150px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
            list-style: none;
            margin: 0;
        `;

        // Create dark mode toggle button
        const darkModeToggle = document.createElement('li');
        const toggleButton = document.createElement('button');
        toggleButton.id = 'darkModeToggle';
        toggleButton.style.cssText = `
            background: #222;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
            width: 100%;
            text-align: left;
        `;
        toggleButton.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        
        darkModeToggle.appendChild(toggleButton);
        settingsDropdown.appendChild(darkModeToggle);

        // Create settings menu container
        const settingsMenu = document.createElement('li');
        settingsMenu.className = 'settings-menu';
        settingsMenu.style.cssText = 'position: relative; display: flex; align-items: center;';
        settingsMenu.appendChild(settingsIcon);
        settingsMenu.appendChild(settingsDropdown);

        // Find navigation menu and add settings
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.appendChild(settingsMenu);
        } else {
            // If no nav menu, add to header
            const header = document.querySelector('header');
            if (header) {
                const nav = header.querySelector('nav');
                if (nav) {
                    const ul = document.createElement('ul');
                    ul.className = 'nav-menu';
                    ul.style.cssText = 'list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 3.5rem;';
                    ul.appendChild(settingsMenu);
                    nav.appendChild(ul);
                }
            }
        }

        // Add event listeners
        settingsIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            settingsDropdown.style.display = settingsDropdown.style.display === 'block' ? 'none' : 'block';
        });

        toggleButton.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target)) {
                settingsDropdown.style.display = 'none';
            }
        });
    }

    addToggleToExistingDropdown() {
        const settingsDropdown = document.getElementById('settingsDropdown');
        const existingToggle = document.getElementById('darkModeToggle');
        
        if (!existingToggle) {
            const darkModeToggle = document.createElement('li');
            const toggleButton = document.createElement('button');
            toggleButton.id = 'darkModeToggle';
            toggleButton.style.cssText = `
                background: #222;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: 0.3s;
                width: 100%;
                text-align: left;
            `;
            toggleButton.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
            
            darkModeToggle.appendChild(toggleButton);
            settingsDropdown.insertBefore(darkModeToggle, settingsDropdown.firstChild);

            toggleButton.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
    }

    updateToggleButton() {
        const toggleButton = document.getElementById('darkModeToggle');
        if (toggleButton) {
            toggleButton.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }
}

// Initialize dark mode manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.darkModeManager = new DarkModeManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.darkModeManager = new DarkModeManager();
    });
} else {
    window.darkModeManager = new DarkModeManager();
} 