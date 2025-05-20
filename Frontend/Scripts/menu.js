const openMenu = document.querySelector("#open-menu");
const CloseMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");
openMenu.addEventListener("click", () => {
  aside.classList.add("aside-visible");
})
CloseMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })