// script.js
document.getElementById("submitBtn").addEventListener("click", function () {
    // Get form input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Validate input
    if (name === "" || email === "" || message === "") {
        alert("Please fill out all fields.");
        return;
    }

    // Store data in localStorage
    const contactData = {
        name: name,
        email: email,
        message: message,
        date: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem("contactData", JSON.stringify(contactData));

    // Clear the form
    document.getElementById("contactForm").reset();

    // Notify the user
    alert("Your message has been saved locally!");
});
