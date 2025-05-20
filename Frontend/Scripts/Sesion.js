document.addEventListener("DOMContentLoaded", () => {
  const btnIniciar = document.querySelector(".submit");
  btnIniciar.addEventListener("click", iniciarSesion);
});

async function iniciarSesion() {
  const correo = document.getElementById("email").value;
  const contra = document.getElementById("password").value;

  if (!correo || !contra) {
    alertify.alert("Advertencia", "Por favor, ingrese su correo y contraseña");
    return;
  }

  try {
    const ipServidor = window.location.hostname;
    const response = await fetch(`http://${ipServidor}:3000/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, contra })
    });

    if (!response.ok) {
      const errorData = await response.json();
      alertify.alert("Error", errorData.message || "Correo o contraseña incorrectos");
      return;
    }

    const data = await response.json();
    alertify.alert("Éxito", "Inicio de sesión exitoso", function() {
      localStorage.setItem("sesionIniciada", JSON.stringify(data.usuario));
      window.location.href = "/Frontend/Pages/DashBoard.html";
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alertify.alert("Error", "Error en la comunicación con el servidor");
  }
}
