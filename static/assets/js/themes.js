$(document).ready(function () {
    // Check local storage for user's theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        $('#theme-stylesheet').attr('href', currentTheme);
    }

    // Toggle dark mode when the checkbox changes
    $('#dark-mode-toggle').change(function () {
        if ($(this).is(':checked')) {
            // Set the dark theme
            $('#theme-stylesheet').attr('href', 'dark.css');
            // Store the theme preference in local storage
            localStorage.setItem('theme', './assets/css/themes/dark.css');
        } else {
            // Set the light theme
            $('#theme-stylesheet').attr('href', 'light.css');
            // Store the theme preference in local storage
            localStorage.setItem('theme', './assets/css/themes/light.css');
        }
    });
});