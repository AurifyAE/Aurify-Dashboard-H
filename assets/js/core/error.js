// Check if the screen width is below a certain threshold (e.g., 768 pixels for tablets)
if (window.innerWidth < 1000) {
    // Redirect users from mobile and tablet devices to a different page or show an error message
    window.location.href = '../../../pages/error.html'; // Redirect to a mobile error page
}
