document.addEventListener("DOMContentLoaded", () => {

/* PROTECCION DE LOGIN */

 const sesion = localStorage.getItem("sesionIniciada");
const mainDashboard = document.getElementById("mainDashboard");
const onlineSpan = document.getElementById("online");


 if (!sesion) {
  mainDashboard.style.display = "none";
  onlineSpan.textContent = "Desconectado";
  onlineSpan.style.color = "red";
  alertify.alert("Advertencia", "Debes iniciar sesión primero", function () {
    window.location.href = "/Frontend/Pages/login.html";
  });
} else {
  mainDashboard.style.display = "block";
  onlineSpan.textContent = "En línea";
  onlineSpan.style.color = "green";
}

const btnSalir = document.querySelector("#outlogin");
if (btnSalir) {
  btnSalir.addEventListener("click", () => {
    alertify.confirm(
      "Confirmación",
      "¿Estás seguro de que deseas cerrar sesión?",
      function () {
        localStorage.removeItem("sesionIniciada");
        alertify.success("Sesión cerrada correctamente");
        setTimeout(() => {
          window.location.href = "/Frontend/Pages/login.html";
        }, 1000);
      },
      function () {
        alertify.error("Cancelaste el cierre de sesión");
      }
    );
  });
}

/*TERMINA LOGIN*/ 


    /*---------CREAR NUEVO PRODUCTO DATOS PRODUCTOS-----------*/
  const formProductos = document.querySelector('.form-productos');
  const btnCrearProducto = document.querySelector('.guardarproducto');
  const categoriaSelect = document.getElementById("categoria");
  const tipoSelect = document.getElementById("tipo");

    btnCrearProducto.addEventListener('click', async function (event) {
    event.preventDefault();


    let idProducto = document.querySelector('#idProducto').value;
    const categoria = document.querySelector('#categoria').value;
    const tipo = document.querySelector('#tipo').value;
    const marca = document.querySelector('#marca').value;
    const referencia = document.querySelector('#referencia').value;
    const precio = document.querySelector('#precio').value;
    const descuento = document.querySelector('#descuento').value;
    let IdVariante = document.querySelector("#idvariante").value;
    const colorHex = document.querySelector("#colorvariante").value;
    const ColorR= document.querySelector("#nombrecolor").value;
    const Stock = document.querySelector("#stock").value;
    const imagen = obtenerURLImagen();

    if (!idProducto && !IdVariante) {
      idProducto = Date.now();
      IdVariante = Date.now(); // Genera un ID único basado en la fecha y hora
    }
    if (!categoria || !tipo || !marca || !referencia || !precio || !imagen || !Stock) {
      alertify.alert('Todos los campos son obligatorios');
      return;
    }

    // Crear objeto con los datos del producto
    const producto = {
      IdProducto: parseInt(idProducto),
      IdTipo: parseInt(tipo),
      Referencia: referencia,
      IdMarca: parseInt(marca),
      Precio: parseFloat(precio),
      Descuento: parseFloat(descuento) || 0,
      URLImagen: imagen,
      IdVariante: parseInt(IdVariante),
      CodigoColorHex: colorHex || null,
      colorReferencia:  ColorR || null,
      stock: parseInt(Stock) || 0
    };

    try {
      const ipServidor = window.location.hostname;
      const response = await fetch(`http://${ipServidor}:3000/api/productoscrud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });

      const data = await response.json();
      if (response.ok) {
        alertify.success('Producto creado exitosamente');
        formProductos.reset();
        cargarProductos();
      } else {
        alertify.error(data.message || 'Error al crear el producto');
      }
    } catch (error) {
      alertify.error('Error al conectarse al servidor');
    }
  });

/*--------------MODIFICAR LOS DATOS DE LOS PRODUCTOS--------------------*/

const modalEditar = document.getElementById('EditarProducto');
modalEditar.addEventListener('show.bs.modal', async (event) => {
  const button = event.relatedTarget;
  const idProducto = button.getAttribute('data-id');

  if (!idProducto) {
    console.error("No se encontró el id del producto");
    return;
  }

  modalEditar.setAttribute('data-id', idProducto);
  await cargarDatosProducto(idProducto);
});

async function cargarDatosProducto(idProducto) {
  try {
    const ipServidor = window.location.hostname;

    const response = await fetch(`http://${ipServidor}:3000/api/productoscrud/${idProducto}`);

    if (!response.ok) throw new Error("Error al obtener el producto.");

    const producto = await response.json();

    document.getElementById("editarreferencia").value = producto.Referencia || "";
    document.getElementById("editarprecio").value = producto.Precio || 0;
    document.getElementById("editardescuento").value = producto.Descuento || 0;
    
    const urlImagen = producto.URLImagen || "";
    const nombreArchivo = urlImagen.split('/').pop();
    document.getElementById("editarimagen").value = nombreArchivo;
    document.getElementById("editarcategoria").value = producto.IdCategoria || "";

    await cargarTiposPorCategoria(producto.IdCategoria, producto.IdTipo);

  } catch (error) {
    console.error("Error al cargar los datos del producto:", error);
  }
}

async function cargarTiposPorCategoria(categoriaId, tipoIdSeleccionado) {
  const tipoSelect = document.getElementById("editartipo");
  if (!categoriaId) {
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    return;
  }

  try {
    const ipServidor = window.location.hostname;
    const response = await fetch(`http://${ipServidor}:3000/api/productoscrud/tipos/${categoriaId}`);

    if (!response.ok) throw new Error("Error al obtener los tipos.");

    const tipos = await response.json();

    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';

    tipos.forEach(tipo => {
      const option = document.createElement("option");
      option.value = tipo.IdTipo;
      option.textContent = tipo.NombreTipo;

      if (tipo.IdTipo.toString() === tipoIdSeleccionado?.toString()) {
        option.selected = true;
      }

      tipoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los tipos:", error);
    tipoSelect.innerHTML = '<option value="">Error al cargar tipos</option>';
  } 
}

// Agregar el eventListener solo una vez para el cambio de categoría
document.getElementById("editarcategoria").addEventListener("change", function () {
  const categoriaId = this.value;
  cargarTiposPorCategoria(categoriaId, null);
});



const formEditar = document.querySelector('.modificarproducto');
formEditar.addEventListener('click', async (e) => {
  e.preventDefault();

  const Marca = document.querySelector("#editarmarca").value;
  const Tipo = document.querySelector("#editartipo").value;
  const ref = document.querySelector("#editarreferencia").value;
  const categorias = document.querySelector("#editarcategoria").value;
  const descuentos = document.querySelector("#editardescuento").value;
  const price = document.querySelector("#editarprecio").value;
  const UrlNueva = document.getElementById("editarimagen").dataset.url || obtenerURLImagen("editar");

  const idProducto = modalEditar.getAttribute('data-id');
  
  if (!idProducto) {
    alert("No hay ID del producto para actualizar");
    return;
  }

  const producto = {
    Referencia: ref,
        Precio: parseFloat(price) || 0,
            Descuento: parseFloat(descuentos) || 0,
                IdMarca: parseInt(Marca),
                    IdTipo: parseInt(Tipo),
                        IdCategoria: parseInt(categorias),
                            URLImagen: UrlNueva
  };

  try {
    const ipServidor = window.location.hostname;

    const response = await fetch(`http://${ipServidor}:3000/api/productoscrud/${idProducto}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Error al actualizar producto");
    }

    alertify.success("Producto actualizado exitosamente");
    const modal = bootstrap.Modal.getInstance(modalEditar);
    modal.hide();
    cargarProductos();

  } catch (error) {
    alertify.error("Error al actualizar producto. Verifica la consola.");
  }
});




  /*------------------TERMINA EL MODIFCAR PRODUCTO NUEVO------------------ */
categoriaSelect.addEventListener('change', actualizarTipos);

  function actualizarTipos() {
    const categoriaId = categoriaSelect.value;
    if (!categoriaId) {
      tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
      return;
    }

    const ipServidor = window.location.hostname;
    fetch(`http://${ipServidor}:3000/api/productoscrud/tipos/${categoriaId}`)
      .then((response) => response.json())
      .then((data) => {
        tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
        data.forEach((tipo) => {
          const option = document.createElement("option");
          option.value = tipo.IdTipo;
          option.textContent = tipo.NombreTipo;
          tipoSelect.appendChild(option);
        });
      })
      .catch((err) => {
        console.error("Error al obtener los tipos:", err);
      });
  }

  function obtenerURLImagen(contexto = "crear") {
  let categoriaSelect, nombreImagenInput;

  if (contexto === "editar") {
    categoriaSelect = document.getElementById("editarcategoria");
    nombreImagenInput = document.getElementById("editarimagen");
  } else {
    categoriaSelect = document.getElementById("categoria");
    nombreImagenInput = document.getElementById("imagen");
  }

  const categoriaTexto = categoriaSelect?.options[categoriaSelect.selectedIndex]?.text?.toLowerCase().trim();
  const nombreImagen = nombreImagenInput?.value.trim();

  if (categoriaTexto && nombreImagen) {
    const url = `/Frontend/Public/Img/${categoriaTexto}/${nombreImagen}`;
    console.log(`URL de la imagen generada [${contexto}]:`, url);
    return url;
  }

  return ""; // Retornar vacío si no se puede generar la URL
}

// EVENTOS PARA CREAR (Formulario de creación)
document.getElementById("categoria").addEventListener("change", () => {
  const url = obtenerURLImagen("crear");
  console.log("URL en creación:", url);
});

document.getElementById("imagen").addEventListener("input", () => {
  const url = obtenerURLImagen("crear");
  console.log("URL en creación:", url);
});

// EVENTOS PARA EDITAR (Modal de edición)
document.getElementById("editarcategoria").addEventListener("change", () => {
  const url = obtenerURLImagen("editar");
  document.getElementById("editarimagen").dataset.url = url;
  console.log("URL en edición:", url);
});

document.getElementById("editarimagen").addEventListener("input", () => {
  const url = obtenerURLImagen("editar");
  document.getElementById("editarimagen").dataset.url = url;
  console.log("URL en edición:", url);
});

/*---------------------------CARGAR LOS PRODUCTOS DE LA BASE DE DATOS-----------------------*/ 
  function cargarProductos() {
    const ipServidor = window.location.hostname;
    fetch(`http://${ipServidor}:3000/api/productoscrud`)
      .then((response) => response.json())
      .then((data) => {
        const productosTable = document
          .getElementById("tablaproductos")
          .querySelector("tbody");
        productosTable.innerHTML = "";
        data.forEach((producto) => {
          const row = document.createElement("tr");

          row.innerHTML = `
                        <td>${producto.id}</td>
                        <td>${producto.tipo}</td>
                        <td>${producto.titulo}</td>
                        <td>${producto.marca}</td>
                        <td>${producto.precio.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}</td>
                        <td>${producto.descuento}%</td>
                        <td>
                            <button class="vervariantes-btn"> <i class="bi bi-caret-down-fill"></i></i></button>
                            <button id="btnEditar" type="button" class="editar-btn btn btn-primary" data-bs-toggle="modal" data-bs-target="#EditarProducto" 
                             data-id="${producto.id}"><i class=" bi bi-pencil-square"></i></button>
                            <button class="eliminar-btn" data-id="${producto.id}"><i class="bi bi-trash"></i></button>
                        </td>
                    `;

          productosTable.appendChild(row);

           const btnEliminar = row.querySelector(".eliminar-btn");
           btnEliminar.addEventListener("click", function () {
            const productoId = this.getAttribute("data-id");
            eliminarProducto(productoId);
        });

          const variantesRow = document.createElement("tr");
          variantesRow.classList.add("variant-row");
          variantesRow.style.display = "none";
          variantesRow.innerHTML = `<td colspan="7">
                        <table class="subtabla table table-striped table-bordered mt-2">
                            <thead>
                                <tr>
                                <th>IdVariante</th>
                                <th>ColorHexadecimal</th>
                                <th>NombreColor</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${producto.variantes
                                  .map(
                                    (variante) => `
                                    <tr>
                                        <td>${variante.idVariante}</td>
                                        <td>${variante.colorHexadecimal}</td>
                                        <td>${variante.colorReferencia}</td>
                                        <td>${variante.stock}</td>
                                        <td>
                                        <button class="editarv-btn" data-id=""><i class=" bi bi-pencil-square"></i></button>
                                        <button class="eliminarv-btn" data-id=""><i class="bi bi-trash"></i></button>
                                    </td>
                                </tr>`
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </td>`;

          row
            .querySelector(".vervariantes-btn")
            .addEventListener("click", () => {
              variantesRow.style.display =
                variantesRow.style.display === "table-row"
                  ? "none"
                  : "table-row";
            });

          productosTable.appendChild(variantesRow);
        });
      })
      .catch((err) => {
        console.error("Error al cargar los productos:", err);
      });
  }
  /*---------------------------TERMINA EL CARGAR LOS PRODUCTOS DE LA BASE DE DATOS-----------------------*/ 


/*-----------------ELIMINA UN PRODUCTO-------------------*/ 
async function eliminarProducto(idProducto) {
  alertify.confirm(
    "Confirmación",
    "¿Estás seguro de que deseas eliminar este producto y sus variantes?",
    async function () {
      try {
        const ipServidor = window.location.hostname;
        const response = await fetch(`http://${ipServidor}:3000/api/productoscrud/${idProducto}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alertify.success("Producto eliminado exitosamente");
          cargarProductos(); // Recargar la tabla para ver el cambio
        } else {
          const data = await response.text();
          alertify.error(data || "Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alertify.error("Hubo un error al eliminar el producto");
      }
    },
    function () {
      alertify.error("Eliminación cancelada");
    }
  );
}

/* ELINACION DE PRODUCTO */


  cargarProductos();
  actualizarTipos();
});
