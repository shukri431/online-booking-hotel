// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(currentTheme + '-mode');

    // Update icon based on current theme
    updateIcon(currentTheme);

    themeToggle.addEventListener('click', function() {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.classList.remove(currentTheme + '-mode');
        body.classList.add(newTheme + '-mode');

        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
});
