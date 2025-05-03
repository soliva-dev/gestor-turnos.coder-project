// Inicio de sesion
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    // Obtengo los datos que ingreso el usuario
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Verifico que las credenciales sean correctas
        if (email === "admin@gestor.com" && password === "123456") {
            // Guardo en localStorage que el usuario esta logueado
            localStorage.setItem("loggedIn", true);
            // Muestro alerta de bienvenida y redirijo al inicio
            Swal.fire({
                title: 'Bienvenido!',
                text: 'Sesion inicada correctamente.',
                icon: 'success',
                confirmButtonText: 'Ingresar al Gestor de turnos...'
            }).then(() => {
                window.location.href = "index.html";
            });
        } else {
            // Si no coinciden, tiro error
            throw new Error('Credenciales incorrectas');
        }
    } catch (error) {
        // Si algo falla, muestro alerta con el error
        Swal.fire({
            title: 'Error',
            text: error.message || 'Hubo un problema al intentar iniciar sesion.',
            icon: 'error',
            confirmButtonText: 'Intentar nuevamente'
        });
    }
});