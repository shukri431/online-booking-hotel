document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  const savedTheme = localStorage.getItem("theme");
  

  if (savedTheme === "light") {
    body.classList.add("light-theme");
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    body.classList.add("dark-theme");
    icon.classList.replace("fa-sun", "fa-moon");
  }




  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    body.classList.toggle("dark-theme");

    if (body.classList.contains("light-theme")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
});
