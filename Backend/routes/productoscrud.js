// routes/productosCrud.js
const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../../db");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
     SELECT 
        P.IdProducto,
		    P.Referencia,
        C.NombreCategoria,
        TP.NombreTipo,
        P.Precio,
        P.Descuento,
        M.Nombre AS NombreMarca,
        V.IdVariante,
        V.CodigoColorHex, 
        V.ColorReferencia,
        V.Stock
      FROM Productos P
      JOIN TiposProductos TP ON P.IdTipo = TP.IdTipo
      JOIN Categorias C ON TP.IdCategoria = C.IdCategorias
      JOIN ProductoVariante V ON P.IdProducto = V.IdProducto
      JOIN Marcas M ON P.IdMarca = M.IdMarcas
      ORDER BY C.NombreCategoria, TP.NombreTipo, P.Referencia
    `);

    const productos = result.recordset.reduce((map, row) => {
      if (!map[row.IdProducto]) {
        map[row.IdProducto] = {
          id: row.IdProducto,
          titulo: row.Referencia,
          tipo: row.NombreTipo,
          categoria: { nombre: row.NombreCategoria, id: row.NombreCategoria.toLowerCase() },
          precio: row.Precio,
          descuento: row.Descuento,
          marca: row.NombreMarca,
          variantes:[],
          colores: [],
          ColorReferencia: [],
          stock: row.Stock

        };
      }

      if (row.IdVariante) {
        map[row.IdProducto].variantes.push({
          idVariante: row.IdVariante,
          colorHexadecimal: row.CodigoColorHex,
          colorReferencia: row.ColorReferencia,
          stock: row.Stock
        });
      }

      return map;
    }, {});

    res.json(Object.values(productos));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
});


// Obtener todos los tipos de productos
router.get("/tipos/:categoriaId", async (req, res) => {
  const { categoriaId } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("IdCategoria", sql.Int, categoriaId)
      .query(`
        SELECT IdTipo, NombreTipo 
        FROM TiposProductos 
        WHERE IdCategoria = @IdCategoria
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener tipos de productos");
  }
});




// Crear un producto
// Crear un producto (ahora con la URL de la imagen)
router.post("/", async (req, res) => {
  const { IdProducto,
      IdTipo, 
      Referencia,
      IdMarca, 
      Precio, 
      Descuento,
      URLImagen, 
      IdVariante, 
      CodigoColorHex,
      colorReferencia,
      stock
   } = req.body; 
  try {
    const pool = await poolPromise;
    

    await pool.request()
      .input("IdProducto", sql.Int, IdProducto)
      .input("IdTipo", sql.Int, IdTipo)
      .input("Referencia", sql.VarChar, Referencia)
      .input("IdMarca", sql.Int, IdMarca)
      .input("Precio", sql.Decimal, Precio)
      .input("Descuento", sql.Decimal, Descuento)
      .input("Imagen", sql.VarChar, URLImagen) // Guardamos la URL de la imagen
      .query(`
        INSERT INTO Productos (IdProducto, Referencia, Precio, Descuento, IdMarca, IdTipo, URLImagen) 
        VALUES (@IdProducto, @Referencia, @Precio, @Descuento, @IdMarca, @IdTipo, @Imagen)
      `);


      await pool.request()
      .input("IdVariante", sql.Int, IdVariante)
      .input("IdProducto", sql.Int, IdProducto)
      .input("CodigoColorHex", sql.VarChar, CodigoColorHex || null)
      .input("ColorReferencia", sql.VarChar, colorReferencia || null)
      .input("Stock", sql.Int, stock || 0)
      .query(`
        INSERT INTO ProductoVariante (IdVariante, IdProducto, CodigoColorHex, Stock, ColorReferencia ) 
        VALUES (@IdVariante, @IdProducto, @CodigoColorHex, @Stock, @ColorReferencia )
      `);

   res.status(201).json({
      message: "Producto creado exitosamente",
      producto: {
        IdProducto,
        IdTipo,
        Referencia,
        IdMarca,
        Precio,
        Descuento,
        URLImagen,
         Variante: {
          IdVariante,
          CodigoColorHex: CodigoColorHex,
          Stock: stock,
          ColorReferencia: colorReferencia
         }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear producto" });
  }
});


//Cargar el producto antes de la modificacion
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("IdProducto", sql.Int, id)
      .query(`
        SELECT P.*, TP.IdCategoria 
        FROM Productos P
        JOIN TiposProductos TP ON P.IdTipo = TP.IdTipo
        WHERE P.IdProducto = @IdProducto
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el producto." });
  }
});



// Actualizar un producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Referencia, Precio, Descuento, IdMarca, IdTipo, URLImagen } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("IdProducto", sql.Int, id)
      .input("Referencia", sql.VarChar, Referencia)
      .input("Precio", sql.Decimal, Precio)
      .input("Descuento", sql.Decimal, Descuento)
      .input("IdMarca", sql.Int, IdMarca)
      .input("IdTipo", sql.Int, IdTipo)
      .input("Imagen", sql.VarChar, URLImagen)
      .query(` UPDATE Productos 
            SET Referencia = @Referencia, 
            Precio = @Precio, 
            Descuento = @Descuento, 
            IdMarca = @IdMarca, 
            IdTipo = @IdTipo,
            URLImagen = @Imagen     -- Actualiza la columna con la URL de la imagen
            WHERE IdProducto = @IdProducto
              `);

    res.status(200).send("Producto actualizado exitosamente");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar producto");
  }
});

// Ruta para eliminar producto y sus variantes
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const pool = await poolPromise;
  const transaction = pool.transaction(); // Iniciar transacción

  try {
    await transaction.begin();
    
    // Verificar si el producto existe
    const checkRequest = transaction.request();
    const productoExistente = await checkRequest
      .input("IdProducto", sql.Int, id)
      .query("SELECT * FROM Productos WHERE IdProducto = @IdProducto");

    if (productoExistente.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).send("El producto no existe.");
    }

    // Eliminar variantes del producto (si existen)
    const deleteVariantesRequest = transaction.request();
    await deleteVariantesRequest
      .input("IdProducto", sql.Int, id)
      .query("DELETE FROM ProductoVariante WHERE IdProducto = @IdProducto");

    // Eliminar el producto
    const deleteProductoRequest = transaction.request();
    await deleteProductoRequest
      .input("IdProducto", sql.Int, id)
      .query("DELETE FROM Productos WHERE IdProducto = @IdProducto");

    await transaction.commit();
    res.status(200).send("Producto y sus variantes eliminados exitosamente");
  } catch (error) {
    console.error("Error al eliminar el producto y sus variantes:", error);
    await transaction.rollback(); // Revertir cambios si ocurre un error
    res.status(500).send("Error al eliminar el producto y sus variantes");
  }
});

module.exports = router;

