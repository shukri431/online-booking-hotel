import { islogin, navaAction, Activenav } from "./global.js";

const defaultHeroSection = document.getElementById('default-hero');
const loggedInHeroSection = document.getElementById('about-hero-section');
const welcomeMessage = document.getElementById('welcome-message');

function initializeAboutPage() {
    const authActionLinks = document.querySelectorAll(".login-link-wrapper, .signup-link-wrapper"); 
    const userInfoElement = document.querySelector(".nav-user-info"); 
    const logoutElement = document.querySelector(".logged-in-action"); 
    
    navaAction(authActionLinks, userInfoElement, logoutElement);

    const navLinks = document.querySelectorAll("a.nav-link");
    Activenav(navLinks);
    
    const loginStatus = islogin();

    if (loginStatus.login && loggedInHeroSection && defaultHeroSection) {
        defaultHeroSection.style.display = 'none';
        loggedInHeroSection.style.display = 'block';

        if (loginStatus.name && welcomeMessage) {
            welcomeMessage.textContent = `WELCOME BACK, ${loginStatus.name.toUpperCase()}!`;
        }
    } else if (defaultHeroSection) {
        defaultHeroSection.style.display = 'block';
        if (loggedInHeroSection) {
             loggedInHeroSection.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeAboutPage);