document.getElementById("contact").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita que el formulario se envíe

    // Mostrar alerta con SweetAlert2
    Swal.fire({
      title: "¡Formulario enviado!",
      text: "Tu información ha sido enviada con éxito.",
      icon: "success",
      confirmButtonText: "Aceptar",
      showConfirmButton: true
    }).then(() => {
      document.getElementById("contact").reset();
    });
  });