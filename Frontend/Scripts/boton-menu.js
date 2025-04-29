
  const openMenuBtn = document.getElementById("open-menu");
  const closeMenuBtn = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  openMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
  });

  closeMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
