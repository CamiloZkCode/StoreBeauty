const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require("../../db.js");

router.post('/', async (req, res) => {
  const { correo, contra } = req.body;

  if (!correo || !contra) {
    return res.status(400).json({ message: "Correo y contraseña son requeridos" });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Correo', sql.VarChar(100), correo)
      .input('Contra', sql.VarChar(100), contra)
      .query('SELECT IdUsuarios, Correo, Rol FROM Usuarios WHERE Correo = @Correo AND Contra = @Contra');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const usuario = result.recordset[0];

    // Validar que sea administrador
    if (usuario.Rol !== 'Administrador') {
      return res.status(403).json({ message: "Acceso denegado. Solo administradores pueden ingresar." });
    }

    // Login exitoso para admin
    res.json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.IdUsuarios,
        correo: usuario.Correo,
        rol: usuario.Rol
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;
