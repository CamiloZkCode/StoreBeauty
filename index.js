// index.js
const express = require("express");
const cors = require("cors");
const productosRouter = require("./Backend/routes/productos.js");
const pagosRouter = require("./Backend/routes/pagos.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

// Usar rutas
app.use("/api/productos", productosRouter);
app.use("/api/pagos", pagosRouter);

// Error handling global (para capturar cualquier error)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error del servidor");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
