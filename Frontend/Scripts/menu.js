// Seleccionamos el botón que abrirá el menú lateral 
const openMenu = document.querySelector("#open-menu");

// Seleccionamos el botón que cerrará el menú lateral
const CloseMenu = document.querySelector("#close-menu");

// Seleccionamos el elemento <aside> que representa el menú lateral
const aside = document.querySelector("aside");

// Cuando se haga clic en el botón de abrir menú.
openMenu.addEventListener("click", () => {

    //se añade la clase "aside-visible" al <aside>, lo que lo hace visible
  aside.classList.add("aside-visible");
})

// Cuando se haga clic en el botón de cerrar menú...
CloseMenu.addEventListener("click", () => {

    // se remueve la clase "aside-visible" del <aside>, ocultándolo nuevamente
    aside.classList.remove("aside-visible");
  })