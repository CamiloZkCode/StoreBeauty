document.addEventListener("DOMContentLoaded", () => {
    const totalElemento = document.getElementById("total");
    const ProductosCarrito = JSON.parse(localStorage.getItem("ProductosAgregadosCarrito")) || [];
    const totalCompra = localStorage.getItem("totalCompra");

    if (ProductosCarrito.length > 0 && totalCompra) {
        totalElemento.textContent = parseFloat(totalCompra).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    } else {
        alert("No tienes productos en el carrito. Serás redirigido a la tienda.");
        window.location.href = "/Frontend/Pages/Store.html";
    }
});

