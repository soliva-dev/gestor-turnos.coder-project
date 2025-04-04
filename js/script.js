// Verifica si el usuario inicio sesion; si no, lo redirige al login
if (!localStorage.getItem("loggedIn")) {
    console.log("User no logueado, redirigiendo al login");
    window.location.href = "login.html";
}

// Funcion para cerrar sesion y redireccionar al login
function cerrarSesion() {
    localStorage.removeItem("loggedIn");
    console.log("Sesion de user cerrada");
    window.location.href = "login.html";
}

// Define los horarios disponibles
const horarios = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

// Funcion para llenar los select de horas dinamicamente
function llenarSelectHoras(idSelect) {
    const select = document.getElementById(idSelect);
    select.innerHTML = '<option value="">Seleccione una hora</option>';

    horarios.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        select.appendChild(option);
    });
}

// Llenamos los select de horas al cargar la pagina
llenarSelectHoras("horaReserva");

// Funcion que genera turnos dinamicos para los proximos 7 dias habiles
function generarTurnos() {
    const turnos = [];
    let fechaActual = new Date();

    for (let i = 0; i < 7; i++) {
        fechaActual.setDate(fechaActual.getDate() + 1);

        // Si es sabado (6) o domingo (0), saltamos
        if (fechaActual.getDay() === 0 || fechaActual.getDay() === 6) {
            i--;
            continue;
        }

        const fechaStr = fechaActual.toISOString().split("T")[0];

        horarios.forEach(hora => {
            turnos.push({ id: turnos.length + 1, cliente: null, fecha: fechaStr, hora: hora });
        });
    }
    console.log(`Turnos generados: ${turnos.length} turnos.`);
    return turnos;
}

// Carga los turnos desde LocalStorage o los genera si no existen
const turnos = JSON.parse(localStorage.getItem("turnos")) || generarTurnos();
guardarTurnos();

// Funcion para guardar turnos en LocalStorage
function guardarTurnos() {
    console.log("Turnos guardados en localstorage.");
    localStorage.setItem("turnos", JSON.stringify(turnos));
}

// Funcion para mostrar turnos disponibles
function mostrarTurnosDisponibles(turnosFiltrados = turnos.filter(turno => turno.cliente === null)) {
    const lista = document.getElementById("listaTurnos");
    lista.innerHTML = "";

    if (turnosFiltrados.length === 0) {
        lista.innerHTML = "<li>No hay turnos disponibles</li>";
        return;
    }

    turnosFiltrados.forEach(turno => {
        const item = document.createElement("li");
        item.textContent = `Fecha: ${turno.fecha} - Hora: ${turno.hora}`;
        lista.appendChild(item);
    });
}

// Funcion para mostrar turnos reservados
function mostrarTurnosReservados(turnosFiltrados = turnos.filter(turno => turno.cliente !== null)) {
    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";

    if (turnosFiltrados.length === 0) {
        lista.innerHTML = "<li>No hay turnos reservados</li>";
        return;
    }

    turnosFiltrados.forEach(turno => {
        const item = document.createElement("li");
        item.textContent = `Fecha: ${turno.fecha} - Hora: ${turno.hora} - Cliente: ${turno.cliente}`;
        
        // Crear el botón de cancelación
        const cancelarBtn = document.createElement("button");
        cancelarBtn.textContent = "Cancelar turno";
        cancelarBtn.classList.add("cancelar-btn");
        cancelarBtn.addEventListener("click", function() {
            cancelarTurno(turno);
        });

        // Añadir el botón al elemento de la lista
        item.appendChild(cancelarBtn);
        lista.appendChild(item);
    });
} 

// Funcion para cancelar el turno
function cancelarTurno(turno) {
    const turnoEncontrado = turnos.find(t => t.id === turno.id);
    
    if (turnoEncontrado && turnoEncontrado.cliente !== null) {
        turnoEncontrado.cliente = null;
        guardarTurnos();
        mostrarTurnosDisponibles();
        mostrarTurnosReservados();
        alert("¡Turno cancelado con éxito!");
        console.log("Turno cancelado con éxito");
    } else {
        alert("No se pudo cancelar el turno, ya que no está reservado.");
        console.log("No se pudo cancelar el turno, ya que no está reservado.");
    }
}

// Evento para reservar un turno
document.getElementById("formReservar").addEventListener("submit", function (event) {
    event.preventDefault();

    const fecha = document.getElementById("fechaReserva").value;
    const hora = document.getElementById("horaReserva").value;
    const nombre = document.getElementById("nombreReserva").value;

    const turnoEncontrado = turnos.find(turno => turno.fecha === fecha && turno.hora === hora && turno.cliente === null);

    if (turnoEncontrado) {
        turnoEncontrado.cliente = nombre;
        guardarTurnos();
        mostrarTurnosDisponibles();
        mostrarTurnosReservados();
        cargarTurnosEnCalendario();

        document.getElementById("formReservar").reset();
        alert("¡Turno reservado con exito!");
        console.log("Turno reservado");
    } else {
        alert("El turno ya esta reservado. Por favor, elige otro.");
        console.log("El turno ya esta reservado");
    }
});

// Funcion para filtrar turnos disponibles por fecha
function filtrarTurnosDisponibles() {
    const fechaBuscada = document.getElementById("buscadorFecha").value;
    console.log(`Filtrando turnos disponibles por fecha: ${fechaBuscada}...`);
    const turnosFiltrados = turnos.filter(turno => turno.cliente === null && turno.fecha.includes(fechaBuscada));
    mostrarTurnosDisponibles(turnosFiltrados);
}

// Funcion para filtrar turnos reservados por fecha
function filtrarTurnosReservados() {
    const fechaBuscada = document.getElementById("buscadorFechaReservados").value;
    console.log(`Filtrando turnos reservados por fecha: ${fechaBuscada}...`);
    const turnosFiltrados = turnos.filter(turno => turno.cliente !== null && turno.fecha.includes(fechaBuscada));
    mostrarTurnosReservados(turnosFiltrados);
}

// Funcion para mostrar turnos reservados en un calendario
function cargarTurnosEnCalendario() {
    console.log("Cargando turnos reservados en el calendario...");
    const turnosReservados = turnos.filter(turno => turno.cliente !== null);

    const eventos = turnosReservados.map(turno => {
        return {
            title: `${turno.cliente}`,
            start: `${turno.fecha}T${turno.hora}:00`,
            allDay: false,
            description: `Turno reservado por ${turno.cliente}`,
            color: '#ff0000'
        };
    });

    $('#calendar').fullCalendar({
        events: eventos,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true,
        eventRender: function(event, element) {
            // Hacer que el texto de los eventos sea más flexible
            element.find('.fc-title').css({
                'white-space': 'normal',
                'word-wrap': 'break-word',
            });
        }
    });
}

// Llama a la funcion para cargar los turnos en el calendario
$(document).ready(function() {
    cargarTurnosEnCalendario();
    console.log("Calendario cargado");
});

// Carga inicial de turnos en pantalla
mostrarTurnosDisponibles();
mostrarTurnosReservados();
