let ProductosCarrito = localStorage.getItem("ProductosAgregadosCarrito");
ProductosCarrito = JSON.parse(ProductosCarrito);

const ContenedorCarritoVacio = document.querySelector("#cart-empty");
const ContenedorProductos = document.querySelector("#contenedor-productos");
const ContenedorCarritoAcciones = document.querySelector("#cart-action");
const BotonVaciar = document.querySelector("#Vaciar");
const ContenedorTotal = document.querySelector("#total");
let  BotonEliminar = document.querySelector(".cart-delete-product");


function CargarProductosCarrito() {
    if (ProductosCarrito && ProductosCarrito.length > 0) {


        ContenedorCarritoVacio.classList.add("disabled");
        ContenedorProductos.classList.remove("disabled");
        ContenedorCarritoAcciones.classList.remove("disabled");

        ContenedorProductos.innerHTML = "";
    
        ProductosCarrito.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("productoEnCarrito");
        div.innerHTML = `
    
         <div class="cart-product"> 
                  <img
                    class="cart-product-img"
                    src="${producto.imagen}"
                    alt="${producto.titulo}"
                  />
                  <div class="cart-name-product">
                    <small>PRODUCTO</small>
                    <h5>${producto.titulo}</h5>
                  </div>
    
                  <div class="cart-quantity-product">
                    <small>CANTIDAD</small>
                    <p>${producto.cantidad}</p>
                  </div>
    
                  <div class="cart-tone-product">
                    <small>TONO</small>
                    <p>${producto.nombreColorSeleccionado}</p>
                  </div>
    
                  <div class="cart-price-product">
                    <small>PRECIO</small>
                    <p>${(producto.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP',  minimumFractionDigits: 0,
                      maximumFractionDigits: 0 })}</p>
                  </div>
    
                  <div class="cart-subtotal-product">
                    <small>SUBTOTAL</small>
                    <p>${(producto.cantidad * producto.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP',  minimumFractionDigits: 0,
                      maximumFractionDigits: 0 })}</p>
                  </div>
    
    
                  <button class="cart-delete-product" id="${producto.id}"> <i class="bi bi-trash"></i> </button>
               
            `;
        ContenedorProductos.append(div);
    
    
        });
    } else{
        ContenedorCarritoVacio.classList.remove("disabled");
        ContenedorProductos.classList.add("disabled");
        ContenedorCarritoAcciones.classList.add("disabled");
            
    }

    ActualizarBotonEliminar();
    ActualizarTotalCarrito();


}

CargarProductosCarrito();


function ActualizarBotonEliminar(){
    BotonEliminar = document.querySelectorAll(".cart-delete-product");
     BotonEliminar.forEach(boton => {
         boton.addEventListener("click", EliminarDelCarrito);
        
         });
     }


function EliminarDelCarrito(e){
    const idBoton = e.currentTarget.id;
    const index = ProductosCarrito.findIndex(producto => producto.id === Number(idBoton));
    ProductosCarrito.splice(index, 1);
    CargarProductosCarrito();
    localStorage.setItem("ProductosAgregadosCarrito", JSON.stringify(ProductosCarrito));
  
}

BotonVaciar.addEventListener("click", VaciarCarrito);
function VaciarCarrito(){
  ProductosCarrito.length = 0;
  localStorage.setItem("ProductosAgregadosCarrito", JSON.stringify(ProductosCarrito));
  CargarProductosCarrito();
}

function ActualizarTotalCarrito() {
    const totalCalculado = ProductosCarrito.reduce((acc,producto) => acc + (producto.precio) * (producto.cantidad),0);
    ContenedorTotal.innerHTML = totalCalculado.toLocaleString('es-CO', { style: 'currency', currency: 'COP',  minimumFractionDigits: 0,
      maximumFractionDigits: 0});

        localStorage.setItem("totalCompra", totalCalculado);
}




