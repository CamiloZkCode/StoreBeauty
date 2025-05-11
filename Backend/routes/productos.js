// routes/productos.js
const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../../db");

router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        C.NombreCategoria, TP.NombreTipo, P.IdProducto, P.Referencia, 
        P.Precio, M.Nombre AS NombreMarca, P.URLImagen,
        V.CodigoColorHex, V.ColorReferencia
      FROM Productos P
      INNER JOIN TiposProductos TP ON P.IdTipo = TP.IdTipo
      INNER JOIN Categorias C ON TP.IdCategoria = C.IdCategorias
      INNER JOIN ProductoVariante V ON P.IdProducto = V.IdProducto
      INNER JOIN Marcas M ON P.IdMarca = M.IdMarcas
      ORDER BY C.NombreCategoria, TP.NombreTipo, P.Referencia
    `);

    const productos = result.recordset.reduce((map, row) => {
      if (!map[row.IdProducto]) {
        map[row.IdProducto] = {
          id: row.IdProducto,
          titulo: row.Referencia,
          imagen: row.URLImagen,
          categoria: { nombre: row.NombreCategoria, id: row.NombreCategoria.toLowerCase() },
          precio: row.Precio,
          marca : row.NombreMarca,
          colores: [],
          ColorReferencia:[]
        };
      }

      if (row.CodigoColorHex && row.ColorReferencia) {
        map[row.IdProducto].colores.push(row.CodigoColorHex); 
        map[row.IdProducto].ColorReferencia.push(row.ColorReferencia);
      }
      return map;
    }, {});

    res.json(Object.values(productos));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
});

module.exports = router;
