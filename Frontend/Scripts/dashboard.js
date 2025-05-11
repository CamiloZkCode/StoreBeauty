let list = document.querySelectorAll(".boton-menu");

function activelink(){
    list.forEach((item) => {
    item.classList.remove("boton-active")
    })
    this.classList.add("boton-active")
}

list.forEach((item) => item.addEventListener("mouseover", activelink));



let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".aside");
let main = document.querySelector(".main");

toggle.onclick = function(){
    navigation.classList.toggle("active");
    main.classList.toggle("active")
}