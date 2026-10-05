const Activenav = (links) => {
    links.forEach(link => {
        if (link.getAttribute('href') === 'signup.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

const ProctectRoutes = () => {
};

const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const showPasswordCheckbox = document.getElementById("show-password"); 

const strengthfill = document.querySelector(".strength-fill"); 
const strengthtext = document.querySelector(".strength-text"); 

const form = document.getElementById("signup-form"); 
const submitButton = form.querySelector('button[type="submit"]');

ProctectRoutes(); 
const Active_links = document.querySelectorAll("a.nav-link")
Activenav(Active_links); 

const USER_STORAGE_KEY = "users";
const Lusers = localStorage.getItem(USER_STORAGE_KEY);
const Users = JSON.parse(Lusers) || []; 

const passwordinputchecker = (password) => {
    let feedback = [];
    let score = 0;
    
    if (password.length >= 8) { score += 25; } else { feedback.push("8 characters"); }
    if (/[a-z]/.test(password)) { score += 25; } else { feedback.push("lowercase letters"); }
    if (/[A-Z]/.test(password)) { score += 25; } else { feedback.push("uppercase letters"); }
    if (/[0-9]/.test(password)) { score += 25; } else { feedback.push("numbers"); }

    if (score < 50) {
        return { percentage: score, class: "weak", Text: `Weak - Add ${feedback.join(", ")}` };
    } else if (score < 75) {
        return { percentage: score, class: "medium", Text: `Good password` };
    } else {
        return { percentage: score, class: "strong", Text: `Strong password` };
    }
}

passwordInput.addEventListener("input", function() {
    const password = this.value;
    const strength = passwordinputchecker(password);
    
    strengthfill.style.width = `${strength.percentage}%`;
    strengthfill.className = `strength-fill ${strength.class}`;
    strengthtext.className = `strength-text ${strength.class}`;
    strengthtext.textContent = strength.Text;
});

showPasswordCheckbox.addEventListener("change", function() {
    const newType = this.checked ? "text" : "password";
    passwordInput.setAttribute('type', newType);
    confirmPasswordInput.setAttribute('type', newType);
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!fullname || !email || !password || !confirmPassword) {
        Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please fill in all required inputs!', confirmButtonColor: '#A47E53' });
        return;
    }
    
    if (password !== confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'The password fields do not match.', confirmButtonColor: '#e74c3c' });
        return;
    }

    const checkUserExists = Users.some((user) => user.email === email);

    if (checkUserExists) {
        Swal.fire({ icon: 'error', title: 'Account Taken!', text: "This email is already registered. Please log in.", confirmButtonColor: '#e74c3c' });
        return;
    }

    
    const currentUser = {
        fullname,
        email,
        password: btoa(password),
    };
    
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Creating account...`;
    submitButton.disabled = true;

    setTimeout(() => {
        Users.push(currentUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(Users));
        
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        Swal.fire({
            title: 'Account Created! 🎉',
            text: `Welcome, ${fullname.split(' ')[0]}! You are now logged in.`,
            icon: 'success',
            confirmButtonText: 'Continue to Home',
            confirmButtonColor: '#A47E53'
        }).then(() => {
            window.location.href = "index.html";
        });

        submitButton.innerHTML = `<i class="fas fa-user-plus"></i> Register`;
        submitButton.disabled = false;
    }, 2000); 
});