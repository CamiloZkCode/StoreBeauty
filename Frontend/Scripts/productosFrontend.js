let productos = []; 

document.addEventListener("DOMContentLoaded", () => {
  const ipServidor = window.location.hostname; // Detecta automáticamente la IP del servidor
  fetch(`http://${ipServidor}:3000/api/productos`)
    .then((res) => res.json())
    .then((data) => { 
      productos = data;


      const categoriaURL = obtenerCategoriaDeURL();
      if (categoriaURL) {
        const ProductosFiltrados = productos.filter(producto => producto.categoria.id == categoriaURL);
        CargarProductos(ProductosFiltrados);

        const categoriaNombre = ProductosFiltrados[0]?.categoria.nombre || "Categoría";
        TituloPrincipal.innerHTML = categoriaNombre;
        
        BotonCategorias.forEach((boton) => {
          if (boton.id === categoriaURL) {
            boton.classList.add("boton-active");
          } else {
            boton.classList.remove("boton-active");
          }
        });
      } else {
        CargarProductos(productos);
        TituloPrincipal.innerHTML = "TODOS LOS PRODUCTOS";
        
        const botonTodos = document.querySelector("#todos");
        botonTodos.classList.add("boton-active");
      }
      
      const urlActual = new URL(window.location.href);
      window.history.pushState({}, "", urlActual.pathname);

    })
    .catch((error) => console.error("Error al cargar productos:", error));
});



const ContenedorProductos = document.querySelector("#Contenedor-productos");
const BotonCategorias = document.querySelectorAll(".boton-cat");
const TituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".AggProducto");
const numerito = document.querySelector("#numerito");

function CargarProductos(ProductosElegidos) {
 
    ContenedorProductos.innerHTML = "";
    ProductosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.dataset.id = producto.id; 
    div.dataset.colorSeleccionado = ""; // Inicialmente no hay color seleccionado 
    let coloresHtml = "";

    if (producto.colores && producto.colores.length > 0) {
    producto.colores.forEach((color,index) => {
    let referencia = producto.ColorReferencia[index] || "Sin tono"
        coloresHtml += `<span class="color" 
         style="background-color: ${color};"
         title="${referencia}"> 
         </span>`;
        });
    }

    div.innerHTML = `
            <div class="Imagen">
                <img class="img-product" src="${producto.imagen}" alt="${producto.titulo}"/>
            </div>
            <div class="container-info">
                <div class="details-product">
                    <h3 class="name-product">${producto.titulo}  ${producto.marca}</h3>
                        <div class="tonos">
                            ${coloresHtml}
                        </div>
                    <p class="price-product">${producto.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0,maximumFractionDigits: 0})}</p>
                </div>
                <button class="AggProducto" id="${producto.id}">Agregar</button>
            </div> `;

        ContenedorProductos.append(div);
    });
    
    ActualizarBotonesAgregar();
    ColorProducto();
}
  


BotonCategorias.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      BotonCategorias.forEach((boton) => boton.classList.remove("boton-active"));
      e.currentTarget.classList.add("boton-active");
  
      if (e.currentTarget.id !== "todos") {
        const ProductosFiltrados = productos.filter(
          (producto) => producto.categoria.id === e.currentTarget.id
          
        );
        CargarProductos(ProductosFiltrados);
  
        const ProductoCategoria = productos.find(
          (producto) => producto.categoria.id === e.currentTarget.id
        );
        TituloPrincipal.innerHTML = ProductoCategoria?.categoria.nombre ?? "Categoría";
      } else {
        TituloPrincipal.innerHTML = "TODOS LOS PRODUCTOS";
        CargarProductos(productos);
      }
    });
  });

function ActualizarBotonesAgregar(){
   botonesAgregar = document.querySelectorAll(".AggProducto");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
        });
    }

    let ProductosCarrito;
    const ProductosCarritoLS = localStorage.getItem("ProductosAgregadosCarrito");
        if (ProductosCarritoLS) {
              ProductosCarrito = JSON.parse(ProductosCarritoLS);
              ActualizarNumerito();
        }else{
              ProductosCarrito = [];
        }


    function agregarAlCarrito(e) {
    
    const idBoton = Number(e.currentTarget.id);
    const ProductoAgregado = productos.find(producto => producto.id === idBoton);
    const ProductoDiv = e.currentTarget.closest(".producto");
    const nombreColorSeleccionado = ProductoDiv.dataset.colorSeleccionado || "Sin tono";
    const tieneColores = ProductoAgregado.colores && ProductoAgregado.colores.length > 0;

    if (tieneColores && (!nombreColorSeleccionado || nombreColorSeleccionado === "Sin tono")) {
          Swal.fire({
            icon: 'warning',
            title: 'Selecciona un tono',
            text: 'Debes elegir un tono antes de agregar el producto al carrito.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#8B5CF6'});
            
        return;  // No agregamos al carrito si no se seleccionó un color
    }
   
    // Buscamos si el producto ya está en el carrito, considerando el color seleccionado
    const ProductoExistente = ProductosCarrito.findIndex(producto => {
        return producto.id === idBoton && 
               producto.nombreColorSeleccionado === nombreColorSeleccionado;  // Usamos nombreColorSeleccionado
    });

    if (ProductoExistente >= 0) {
        ProductosCarrito[ProductoExistente].cantidad++;
    } else {
        // Si no existe, agregamos el producto con el color seleccionado
        const ProductoConColor = {
            ...ProductoAgregado,
            cantidad: 1,
            nombreColorSeleccionado: nombreColorSeleccionado,  // Usamos nombreColorSeleccionado
        };
        ProductosCarrito.push(ProductoConColor);
    }
        ActualizarNumerito();
        localStorage.setItem("ProductosAgregadosCarrito", JSON.stringify(ProductosCarrito)); 
}

    function ActualizarNumerito() {
        let NuevoNumerito = ProductosCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = NuevoNumerito;
    }



      function ColorProducto() {
        const ColorSeleccionado = document.querySelectorAll(".color");
        ColorSeleccionado.forEach(color => {
          color.addEventListener("click", function(e) {
            const productoDiv = e.currentTarget.closest(".producto");
            productoDiv.querySelectorAll('.color').forEach(c => {
              c.classList.remove("active");
            });
            e.target.classList.add("active"); 
            const nombreColorSeleccionado = e.target.title;
            productoDiv.dataset.colorSeleccionado = nombreColorSeleccionado;

            
          });
        });
      }
    
      function obtenerCategoriaDeURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("categoria");
      }