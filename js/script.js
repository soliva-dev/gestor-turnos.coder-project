// Lista de turnos disponibles
const turnos = [
    { id: 1, cliente: null, fecha: "2025-03-14", hora: "10:00" },
    { id: 2, cliente: null, fecha: "2025-03-14", hora: "11:00" },
    { id: 3, cliente: null, fecha: "2025-03-14", hora: "12:00" },
    { id: 4, cliente: null, fecha: "2025-03-14", hora: "13:00" }
];

// Muestro los turnos disponibles en consola
console.log("Array de turnos disponibles:", turnos);

// Funcion  para mostrar/ocultar acordeon
function mostrarOcultar(id) {
    const elemento = document.getElementById(id);
    elemento.classList.toggle("activo");
    console.log(`${elemento.classList.contains("activo") ? "Abrir" : "Cerrar"} ${id}`);
}

// Funcion para mostrar turnos disponibles
function mostrarTurnosDisponibles() {
    const lista = document.getElementById("listaTurnos");
    lista.innerHTML = "";

    console.log("Lista de turnos disponibles:");

    for (let i = 0; i < turnos.length; i++) {
        const turno = turnos[i];
        if (turno.cliente === null) {
            console.log(`Fecha: ${turno.fecha} - Hora: ${turno.hora}`);
            const item = document.createElement("li");
            item.textContent = `Fecha: ${turno.fecha} - Hora: ${turno.hora}`;
            lista.appendChild(item);
        }
    }
}

// Funcion para mostrar turnos reservados
function mostrarTurnosReservados() {
    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";

    console.log("Lista de turnos reservados:");

    for (let i = 0; i < turnos.length; i++) {
        const turno = turnos[i];

        if (turno.cliente !== null) {
            console.log(`Fecha: ${turno.fecha} - Hora: ${turno.hora} - Cliente: ${turno.cliente}`);
            const item = document.createElement("li");
            item.textContent = `Fecha: ${turno.fecha} - Hora: ${turno.hora} - Cliente: ${turno.cliente}`;
            lista.appendChild(item);
        }
    }
}

// Funcion  para reservar un turno
const reservarTurno = () => {
    const fecha = prompt("Ingrese la fecha del turno (aaaa-mm-dd):");
    const hora = prompt("Ingrese la hora del turno (hh:mm):");
    const nombre = prompt("Ingrese su nombre y apellido:");

    const turnoEncontrado = turnos.find(turno => turno.fecha === fecha && turno.hora === hora && turno.cliente === null);

    if (turnoEncontrado) {
        turnoEncontrado.cliente = nombre;
        alert(`Turno reservado para ${nombre} el ${fecha} a las ${hora}`);
        console.log(`Turno reservado para ${nombre} el ${fecha} a las ${hora}`);
        mostrarTurnosDisponibles();
        mostrarTurnosReservados();
    } else {
        alert(`Error al reservar turno: Fecha ${fecha}, Hora ${hora} no disponible o ya reservada.`);
        console.log(`Error al reservar turno: Fecha ${fecha}, Hora ${hora} no disponible o ya reservada.`);
    }
};

// Funcion para cancelar un turno
const cancelarTurno = () => {
    const fecha = prompt("Ingrese la fecha del turno a cancelar (aaaa-mm-dd):");
    const hora = prompt("Ingrese la hora del turno a cancelar (hh:mm):");

    const turnoEncontrado = turnos.find(turno => turno.fecha === fecha && turno.hora === hora);

    if (turnoEncontrado && turnoEncontrado.cliente !== null) {
        alert(`Turno de ${turnoEncontrado.cliente} cancelado para el ${fecha} a las ${hora}`);
        console.log(`Turno de ${turnoEncontrado.cliente} cancelado para el ${fecha} a las ${hora}`);
        turnoEncontrado.cliente = null;
        mostrarTurnosDisponibles();
        mostrarTurnosReservados();
    } else {
        alert(`Error al cancelar turno: Fecha ${fecha}, Hora ${hora} no reservada o incorrecta.`);
        console.log(`Error al cancelar turno: Fecha ${fecha}, Hora ${hora} no reservada o incorrecta.`);
    }
};

// Mostrar turnos disponibles y reservados
mostrarTurnosDisponibles();
mostrarTurnosReservados();