

//  navigation
const Activenav = (links) => {
    links.forEach(link => {
        if (link.getAttribute('href') === 'login.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

const ProctectRoutes = () => {
 
};



const form = document.getElementById("loginForm");

const Lusers = localStorage.getItem("users");

const Users = JSON.parse(Lusers) || [];


ProctectRoutes();
const Active_links = document.querySelectorAll("a.nav-link");
Activenav(Active_links);


function resetButton(btn, originalText) {
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1000);
}


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = formData.get("email").trim();
    const password = formData.get("password"); 

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

 
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Logging in...`;
    btn.disabled = true;


    if (!email || !password) {
      
        Swal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please fill all required inputs!', confirmButtonColor: '#e74c3c' });
        resetButton(btn, originalText);
        return;
    }

    // --- Find User ---
    const user = Users.find((u) => u.email === email);

    if (!user) {
        // SweetAlert for account not found
        Swal.fire({ icon: 'error', title: 'Account Not Found', text: "No account found with that email. Please sign up.", confirmButtonColor: '#e74c3c' });
        resetButton(btn, originalText);
        return;
    }


    if (atob(user.password) !== password) {
        // SweetAlert for wrong password
        Swal.fire({ icon: 'error', title: 'Wrong Password', text: "The password you entered is incorrect. Please try again.", confirmButtonColor: '#e74c3c' });
        resetButton(btn, originalText);
        return;
    }


    const firstName = user.fullname.split(' ')[0];
    
   
    Swal.fire({
        icon: 'success',
        title: 'Login successful! 🎉',
        text: "Welcome back, " + firstName + "!",
        confirmButtonColor: '#A47E53'
    });

    localStorage.setItem("currentUser", JSON.stringify(user));

   
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);

});