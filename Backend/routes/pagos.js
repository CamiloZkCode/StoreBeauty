// routes/pagos.js
const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../../db.js");

router.post("/", async (req, res) => {
  const { productosCarrito, total } = req.body;

  try {
    const pool = await poolPromise;
    const transaction = await pool.transaction();
    await transaction.begin();

    for (const producto of productosCarrito) {
      await transaction.request()
        .input("idProducto", sql.Int, producto.id)
        .input("codigoColor", sql.VarChar, producto.nombreColorSeleccionado)
        .input("cantidad", sql.Int, producto.cantidad)
        .query(`
          UPDATE ProductoVariante
          SET Stock = Stock - @cantidad
          WHERE IdProducto = @idProducto AND ColorReferencia = @codigoColor
        `);
    }

    const facturaResult = await transaction.request()
      .input("total", sql.Decimal, total)
      .query(`
        INSERT INTO Facturas (Total, Fecha) 
        VALUES (@total, GETDATE());
        SELECT SCOPE_IDENTITY() AS idFactura;
      `);

    const idFactura = facturaResult.recordset[0].idFactura;

    // Guardar detalles de la factura
    for (const producto of productosCarrito) {
      await transaction.request()
        .input("idFactura", sql.Int, idFactura)
        .input("idProducto", sql.Int, producto.id)
        .input("cantidad", sql.Int, producto.cantidad)
        .input("precio", sql.Decimal, producto.precio)
        .query(`
          INSERT INTO DetallesFactura (IdFactura, IdProducto, Cantidad, Precio)
          VALUES (@idFactura, @idProducto, @cantidad, @precio);
        `);
    }

    await transaction.commit();
    res.status(200).json({ message: "Compra realizada", idFactura });

  } catch (err) {
    console.error(err);
    if (pool) await pool.request().query("ROLLBACK TRANSACTION");
    res.status(500).send("Error en la compra");
  }
});

module.exports = router;
