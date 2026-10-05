

export const islogin = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        const nameKey = user.fullname ? 'fullname' : 'firstname';
        const displayName = user[nameKey] ? user[nameKey].split(' ')[0] : 'User'; 
        
        return {
            login: true,
            name: displayName, 
            email: user.email
        };
    } else {
        return {
            login: false,
        };
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

export const navaAction = (authActions, userInfoElement, logoutElement) => {
    const loginStatus = islogin();

    if (logoutElement) {
        logoutElement.innerHTML = ''; 
    }

    if (loginStatus.login) {
        authActions.forEach(el => el.style.display = "none"); 

        userInfoElement.innerHTML = `
            <a href="#" class="nav-link welcome-link">
                👏 Welcome <span>${loginStatus.name}</span>
            </a>
        `;
        userInfoElement.style.display = "flex"; 
        userInfoElement.style.alignItems = "center"; 
        
        logoutElement.innerHTML = `
            <a href="#" class="nav-link logout-btn" id="nav-logout-link">Logout</a>
        `;
        logoutElement.style.display = "flex";
        
        const logoutLink = logoutElement.querySelector('#nav-logout-link');
        if (logoutLink) {
            logoutLink.removeEventListener("click", handleLogout);
            logoutLink.addEventListener("click", handleLogout);
        }
        
    } else {
        authActions.forEach(el => el.style.display = "list-item");
        userInfoElement.style.display = "none";
        logoutElement.style.display = "none";
    }
};


export const ProctectRoutes = () => {
    const currentPagePath = window.location.pathname;
    const loginStatus = islogin();
    
    const authPages = ["login.html", "register.html", "signup.html"];
    const protectedPages = ["Booking.html"]; 

    if (loginStatus.login) {
        if (authPages.some(page => currentPagePath.endsWith(page))) {
            window.location.href = "./index.html";
        }
    } else {
        if (protectedPages.some(page => currentPagePath.endsWith(page))) {
            window.location.href = "./login.html";
        }
    }
};

export const Activenav = (links) => {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "") currentPage = "index.html";

    links.forEach((link) => {
        const linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
};