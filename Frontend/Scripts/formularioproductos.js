document.addEventListener("DOMContentLoaded", () => {
    const list = document.querySelectorAll(".boton-menu");
    const sections = document.querySelectorAll(".seccion");

    function activelink() {
        list.forEach((item) => item.classList.remove("boton-active"));
        this.classList.add("boton-active");

        const sectionId = this.getAttribute("data-section");
        sections.forEach((section) => {
            section.style.display = section.getAttribute("data-section") === sectionId ? "block" : "none";
        });
    }

    list.forEach((item) => item.addEventListener("click", activelink));

    // Configuración inicial de la primera sección activa
    list[0].classList.add("boton-active");
    sections.forEach((section) => {
        section.style.display = section.getAttribute("data-section") === list[0].getAttribute("data-section") ? "block" : "none";
    });

    // Toggle del menú lateral
    const toggle = document.querySelector(".toggle");
    const navigation = document.querySelector(".aside");
    const main = document.querySelector(".main");

    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
});
