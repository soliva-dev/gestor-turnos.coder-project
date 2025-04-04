// Iniciar sesion 
document.getElementById("formLogin").addEventListener("submit", function(event) {
    event.preventDefault();

    // Traigo los valores ingresados
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Valido credenciales
    if (email === "admin@gestor.com" && password === "123456") {
        localStorage.setItem("loggedIn", true);
        window.location.href = "index.html";
    } else {
        alert("Credenciales incorrectas, intenta nuevamente.");
    }
});
