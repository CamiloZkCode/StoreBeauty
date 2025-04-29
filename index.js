const express = require("express");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/productos", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        C.NombreCategoria,
        TP.NombreTipo,
        P.IdProducto,
        P.Referencia,
        P.Precio,
        M.Nombre AS NombreMarca,
        P.URLImagen,
        V.CodigoColorHex,
        V.ColorReferencia
      FROM Productos P
      INNER JOIN TiposProductos TP ON P.IdTipo = TP.IdTipo
      INNER JOIN Categorias C ON TP.IdCategoria = C.IdCategorias
      INNER JOIN ProductoVariante V ON P.IdProducto = V.IdProducto
      INNER JOIN Marcas M ON P.IdMarca = M.IdMarcas
      ORDER BY C.NombreCategoria, TP.NombreTipo, P.Referencia
    `);

    // Agrupar productos por IdProducto
    const productosMap = {};

    result.recordset.forEach(row => {
      if (!productosMap[row.IdProducto]) {
        productosMap[row.IdProducto] = {
          id: row.IdProducto,
          titulo: row.Referencia,
          imagen: row.URLImagen,
          categoria: { nombre: row.NombreCategoria, id: row.NombreCategoria.toLowerCase() },
          precio: row.Precio,
          marca : row.NombreMarca,
          colores: [],
          ColorReferencia:[],
        };
      }

      if (row.CodigoColorHex && row.ColorReferencia) {
        productosMap[row.IdProducto].colores.push(row.CodigoColorHex); 
        productosMap[row.IdProducto].ColorReferencia.push(row.ColorReferencia);
      }
    });
    
    const productos = Object.values(productosMap);
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
