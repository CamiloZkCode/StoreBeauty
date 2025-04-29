# Documentación de la Base de Datos

## 1. Tabla `Usuarios`
Guarda la información de los usuarios registrados.

- **IdUsuario**: Identificador único del usuario.
- **Correo**: Dirección de correo única.
- **ClaveHash**: Contraseña cifrada.
- **Rol**: Define si el usuario es `Cliente` o `Administrador`.

## 2. Tabla `Clientes`
Guarda los datos específicos de los clientes.

- **IdCliente**: Identificador único del cliente.
- **IdUsuario**: Relación con la tabla `Usuarios`.
- **Nombre**: Nombre del cliente.
- **Teléfono**: Número de contacto.

## 3. Tabla `Administradores`
Registra los datos de los administradores.

- **IdAdministrador**: Identificador único.
- **IdUsuario**: Relación con `Usuarios`.
- **Nombre**: Nombre del administrador.
- **Teléfono**: Número de contacto.

## 4. Tabla `Marcas`
Guarda las marcas de los productos.

- **IdMarca**: Identificador único.
- **NombreMarca**: Nombre de la marca.

## 5. Tabla `CategoriasProductos`
Almacena las categorías y tipos de productos.

- **IdCategoria**: Identificador único.
- **NombreCategoria**: Nombre de la categoría (Ej: Labios, Ojos, Facial).
- **TipoProducto**: Tipo dentro de la categoría (Ej: Labial, Pestañina, Suero).

## 6. Tabla `Productos`
Guarda información de productos sin sus variantes.

- **IdProducto**: Identificador único.
- **IdCategoria**: Relación con `CategoriasProductos`.
- **Referencia**: Nombre del producto base.
- **IdMarca**: Relación con `Marcas`.

## 7. Tabla `VariantesProducto`
Almacena las variantes de cada producto.

- **IdVariante**: Identificador único.
- **IdProducto**: Relación con `Productos`.
- **NombreVariante**: Variación (Ej: Color).
- **Precio**: Precio de la variante.
- **Stock**: Cantidad en inventario.
- **Descuento**: Descuento aplicado.
- **URLImagen**: Imagen del producto.

## 8. Tabla `Facturas`
Guarda los pedidos de los clientes.

- **IdFactura**: Identificador único.
- **IdCliente**: Relación con `Clientes`.
- **Fecha**: Fecha de emisión.
- **Total**: Monto total.
- **MetodoPago**: Método de pago.
- **EstadoPago**: Estado del pago.
- **FechaPago**: Fecha del pago.
- **DireccionEnvio**: Dirección ingresada por el cliente para este pedido.

## 9. Tabla `DetallesFactura`
Guarda los productos comprados en cada factura.

- **IdDetalle**: Identificador único.
- **IdFactura**: Relación con `Facturas`.
- **IdVariante**: Relación con `VariantesProducto`.
- **Cantidad**: Cantidad comprada.
- **PrecioUnitario**: Precio del producto en la compra.
- **SubTotal**: (Cantidad * PrecioUnitario).

## 10. Tabla `Inventario`
Controla los movimientos del inventario.

- **IdInventario**: Identificador único.
- **IdVariante**: Relación con `VariantesProducto`.
- **StockPrevio**: Stock antes del movimiento.
- **TipoMovimiento**: `Entrada`, `Salida` o `Cambio`.
- **Cantidad**: Cantidad del movimiento.
- **FechaMovimiento**: Fecha del movimiento.
- **Nota**: Descripción del movimiento.

---
**Notas:**
- La tabla `Inventario` refleja cambios en el stock pero no almacena el stock final, que se mantiene en `VariantesProducto`.
- `Facturas` ahora permite direcciones personalizadas por pedido.

