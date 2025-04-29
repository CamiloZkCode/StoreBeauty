const inputTarjeta = document.getElementById('Numero-Tarjeta');

inputTarjeta.addEventListener('input', (e) => {
    let valor = e.target.value;

    // Eliminar cualquier caracter que no sea número
    valor = valor.replace(/\D/g, '');

    // Limitar a 16 dígitos
    valor = valor.substring(0, 16);
    valor = valor.replace(/(.{4})/g, '$1-').trim();

    // Quitar guion final si existe
    if (valor.endsWith('-')) {
        valor = valor.slice(0, -1);
    }

    e.target.value = valor;
});



// FECHA DE EXPIRACIÓN (formato MM/YY con / automático)
const inputFecha = document.getElementById('Expiracion');
inputFecha.addEventListener('input', (e) => {
    let valor = e.target.value;

    // Eliminar todo lo que no sea número
    valor = valor.replace(/\D/g, '');

    // Limitar a 4 dígitos numéricos
    valor = valor.substring(0, 4);

    // Insertar "/" después del mes
    if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }

    e.target.value = valor;
});

// CÓDIGO CVV (solo números, máximo 3 dígitos)
const inputCVV = document.getElementById('CVV');
inputCVV.addEventListener('input', (e) => {
    let valor = e.target.value;

    // Eliminar todo lo que no sea número
    valor = valor.replace(/\D/g, '');

    // Limitar a 3 dígitos
    valor = valor.substring(0, 3);

    e.target.value = valor;
});
