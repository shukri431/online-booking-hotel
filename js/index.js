// js/index.js (CORRECTED for Hero Button Visibility)

import { islogin, navaAction, ProctectRoutes, Activenav } from "./global.js";

const authActionLinks = document.querySelectorAll(".login-link-wrapper, .signup-link-wrapper"); 
const userInfoElement = document.querySelector(".nav-user-info"); 
const logoutElement = document.querySelector(".logged-in-action"); 

const heroRegBtn = document.querySelector("a.btn.reg");
const heroLogBtn = document.querySelector("a.btn.log");

function updateHeroButtons() {
    const loginStatus = islogin();

    if (loginStatus.login) {
        if (heroRegBtn) heroRegBtn.style.display = 'none';
        if (heroLogBtn) heroLogBtn.style.display = 'inline-flex';
    } else {
        if (heroRegBtn) heroRegBtn.style.display = 'inline-flex';
        if (heroLogBtn) heroLogBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ProctectRoutes(); 

    const navLinks = document.querySelectorAll("a.nav-link");
    Activenav(navLinks);

    navaAction(authActionLinks, userInfoElement, logoutElement);

    updateHeroButtons();
});