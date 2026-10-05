// js/contact.js

import { islogin, navaAction, Activenav } from "./global.js";

// DOM Elements
const authActionLinks = document.querySelectorAll(".login-link-wrapper, .signup-link-wrapper"); 
const userInfoElement = document.querySelector(".nav-user-info"); 
const logoutElement = document.querySelector(".logged-in-action"); 
const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');

/**
 * Pre-fills the contact form with user details if logged in.
 */
function prefillContactForm(loginStatus) {
    if (loginStatus.login) {
        // The islogin() from global.js should return { login: true, name: '...', email: '...' }
        
        // Pre-fill Name field
        if (nameInput && loginStatus.name) {
            // Note: We use loginStatus.name which is the short name, but assume the full name
            // is available in localStorage for a better contact experience.
            try {
                const userData = JSON.parse(localStorage.getItem("currentUser"));
                const fullName = userData.fullname || `${userData.firstname} ${userData.lastname}`.trim();

                nameInput.value = fullName;
                // Optional: Make it read-only so the user knows it's pre-filled
                nameInput.readOnly = true; 
            } catch (e) {
                // Fallback to the short name if localStorage parsing fails
                nameInput.value = loginStatus.name;
                nameInput.readOnly = true; 
            }
        }
        
        // Pre-fill Email field
        if (emailInput && loginStatus.email) {
            emailInput.value = loginStatus.email;
            emailInput.readOnly = true;
        }
    }
}

/**
 * Initializes the Contact page: sets up the navbar and pre-fills the form.
 */
function initializeContactPage() {
    const loginStatus = islogin();
    
    // 1. Setup Navbar (Login/Logout/Name)
    navaAction(authActionLinks, userInfoElement, logoutElement);

    // 2. Set Active Nav Link
    const navLinks = document.querySelectorAll("a.nav-link");
    Activenav(navLinks);
    
    // 3. Pre-fill the contact form
    prefillContactForm(loginStatus);
}

// Run initialization
document.addEventListener('DOMContentLoaded', initializeContactPage);