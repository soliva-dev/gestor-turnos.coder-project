document.addEventListener('DOMContentLoaded', () => {
    // Verifico si el usuario esta logueado
    if (!localStorage.getItem("loggedIn")) {
        Swal.fire({
            title: 'Acceso denegado',
            text: 'Tenes que iniciar sesion para acceder al gestor.',
            icon: 'error',
            confirmButtonText: 'Ir al login'
        }).then(() => {
            window.location.href = 'login.html'; // Redirijo al login
        });
        return; // Detengo la ejecucion si no esta logueado
    }

    cargarTurnosDesdeJSON();
    document.getElementById('formReservar').addEventListener('submit', reservarTurno);
    document.getElementById('fechaReserva').addEventListener('change', () => actualizarHoras(turnosDisponibles));
    inicializarCalendario();
});

document.addEventListener('DOMContentLoaded', () => {
    cargarTurnosDesdeJSON();
    document.getElementById('formReservar').addEventListener('submit', reservarTurno);
    document.getElementById('fechaReserva').addEventListener('change', () => actualizarHoras(turnosDisponibles));
    inicializarCalendario();
});

let turnosDisponibles = [];
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

function cargarTurnosDesdeJSON() {
    fetch('./database/turnos.json')
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar los turnos.');
            return response.json();
        })
        .then(data => {
            turnosDisponibles = data.filter(td => !reservas.some(r => r.fecha === td.fecha && r.hora === td.hora));
            mostrarTurnos();
            mostrarReservas();
            actualizarHoras(turnosDisponibles);
            actualizarCalendario();
        })
        .catch(error => {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los turnos disponibles.', 'error');
        });
}

function mostrarTurnos(filtroFecha = '') {
    const lista = document.getElementById('listaTurnos');
    lista.innerHTML = '';
    const filtrados = filtroFecha ? turnosDisponibles.filter(t => t.fecha === filtroFecha) : turnosDisponibles;
    if (filtrados.length === 0) {
        lista.innerHTML = '<li>No hay turnos disponibles</li>';
        return;
    }
    filtrados.forEach(turno => {
        const li = document.createElement('li');
        li.textContent = `${turno.fecha} - ${turno.hora}`;
        lista.appendChild(li);
    });
}

function actualizarHoras(lista) {
    const select = document.getElementById('horaReserva');
    select.innerHTML = '';
    const fechaSeleccionada = document.getElementById('fechaReserva').value;
    const horas = lista.filter(t => t.fecha === fechaSeleccionada);

    if (horas.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'Sin horarios disponibles';
        option.disabled = true;
        select.appendChild(option);
    } else {
        horas.forEach(t => {
            const option = document.createElement('option');
            option.value = t.hora;
            option.textContent = t.hora;
            select.appendChild(option);
        });
    }
}

function reservarTurno(e) {
    e.preventDefault();

    const fecha = document.getElementById('fechaReserva').value;
    const hora = document.getElementById('horaReserva').value;
    const nombre = document.getElementById('nombreReserva').value;

    // Valido que los campos no esten vacios
    if (!fecha || !hora || !nombre) {
        Swal.fire('Campos obligatorios', 'Por favor, completa todos los campos: Fecha, Hora y Nombre.', 'warning');
        return;
    }

    // Verifico si ya existe una reserva para esa fecha y hora
    const indiceExistente = reservas.findIndex(r => r.fecha === fecha && r.hora === hora);
    if (indiceExistente !== -1) {
        Swal.fire('Turno ya reservado', 'Ya existe un turno reservado para esa fecha y hora.', 'warning');
        return;
    }

    // Verifico si la fecha y hora estan disponibles en la lista de turnos
    const turnoDisponible = turnosDisponibles.find(t => t.fecha === fecha && t.hora === hora);
    if (!turnoDisponible) {
        Swal.fire('Fecha y hora no disponibles', 'La fecha o la hora seleccionada no estan disponibles.', 'warning');
        return;
    }

    // Si todo esta bien, reservo el turno
    const reserva = { fecha, hora, nombre };
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Elimino el turno de los disponibles
    const indiceTurnoDisponible = turnosDisponibles.findIndex(t => t.fecha === fecha && t.hora === hora);
    if (indiceTurnoDisponible !== -1) {
        turnosDisponibles.splice(indiceTurnoDisponible, 1);
    }

    Swal.fire('Turno reservado', `Turno para ${nombre}. Fecha: ${fecha}. Hora: ${hora}.`, 'success');

    // Actualizo la vista
    mostrarTurnos();
    mostrarReservas();
    document.getElementById('formReservar').reset();
    actualizarHoras(turnosDisponibles);
    actualizarCalendario();
}

function mostrarReservas(filtroFecha = '') {
    const lista = document.getElementById('listaReservas');
    lista.innerHTML = '';
    const filtradas = filtroFecha ? reservas.filter(r => r.fecha === filtroFecha) : reservas;

    if (filtradas.length === 0) {
        lista.innerHTML = '<li>No hay turnos reservados</li>';
        return;
    }

    filtradas.forEach((r, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${r.fecha} - ${r.hora} - ${r.nombre} `;

        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.classList.add('btn-cancelar');
        btnCancelar.addEventListener('click', () => cancelarTurno(index));

        li.appendChild(btnCancelar);
        lista.appendChild(li);
    });
}

function cancelarTurno(indice) {
    try {
        const turno = reservas[indice];
        if (!turno) throw new Error('Turno no encontrado');

        Swal.fire({
            title: '¿Estas seguro?',
            text: `Vas a cancelar el turno del ${turno.fecha} a las ${turno.hora} para ${turno.nombre}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, cancelar turno',
            cancelButtonText: 'No, mantener turno'
        }).then((result) => {
            if (result.isConfirmed) {
                // Elimino el turno de reservas
                reservas.splice(indice, 1);
                localStorage.setItem('reservas', JSON.stringify(reservas));

                // Lo devuelvo a los turnos disponibles
                turnosDisponibles.push(turno);

                Swal.fire('Cancelado', 'El turno fue cancelado.', 'success');

                mostrarReservas();
                mostrarTurnos();
                actualizarHoras(turnosDisponibles);
                actualizarCalendario();
            }
        });

    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cancelar el turno.', 'error');
    }
}

function filtrarTurnosDisponibles() {
    const fecha = document.getElementById('buscadorFecha').value;
    mostrarTurnos(fecha);
}

function filtrarTurnosReservados() {
    const fecha = document.getElementById('buscadorFechaReservados').value;
    mostrarReservas(fecha);
}

function limpiarLocalStorage() {
    localStorage.clear();
    reservas = [];
    Swal.fire('LocalStorage limpiado', 'Datos borrados correctamente.', 'info').then(() => {
        window.location.href = 'login.html';
    });
}

function cerrarSesion() {
    Swal.fire('Sesion cerrada', 'Redirigiendo al login...', 'info').then(() => {
        window.location.href = 'login.html';
    });
}

// CALENDARIO
function inicializarCalendario() {
    $('#calendar').fullCalendar({
        locale: 'es',
        header: { left: 'prev,next today', center: 'title', right: 'month,agendaWeek' },
        editable: true, // Habilito drag & drop
        events: [],
        eventDrop: function(event, delta, revertFunc) {
            try {
                const nuevaFecha = moment(event.start).format('YYYY-MM-DD');
                const nuevaHora = moment(event.start).format('HH:mm');
                const nombre = event.title;
        
                // Verifico si la nueva fecha existe en el archivo JSON
                const fechaExistente = turnosDisponibles.some(t => t.fecha === nuevaFecha);
                if (!fechaExistente) {
                    Swal.fire('Fecha no disponible', 'El turno no puede ser movido a esa fecha, ya que no esta disponible.', 'warning');
                    revertFunc();
                    return;
                }
        
                // Verifico si la nueva hora esta disponible en esa fecha
                const turnoNuevoDisponible = turnosDisponibles.find(t => t.fecha === nuevaFecha && t.hora === nuevaHora);
                if (!turnoNuevoDisponible) {
                    Swal.fire('Hora no disponible', 'El turno en la nueva hora no esta disponible.', 'warning');
                    revertFunc();
                    return;
                }
        
                // Busco la reserva original por nombre
                const reservaOriginal = reservas.find(r => r.nombre === nombre);
        
                if (!reservaOriginal) throw new Error('Reserva no encontrada.');
        
                const index = reservas.indexOf(reservaOriginal);
        
                // Verifico si el nuevo turno ya esta reservado
                const ocupado = reservas.some(r => r.fecha === nuevaFecha && r.hora === nuevaHora);
                if (ocupado) {
                    Swal.fire('Ocupado', 'Ese turno ya esta reservado.', 'warning');
                    revertFunc();
                    return;
                }
        
                // Devolvemos el turno anterior a disponibles
                turnosDisponibles.push({ fecha: reservaOriginal.fecha, hora: reservaOriginal.hora });
        
                // Elimino el nuevo turno de disponibles
                const i = turnosDisponibles.findIndex(t => t.fecha === nuevaFecha && t.hora === nuevaHora);
                if (i !== -1) turnosDisponibles.splice(i, 1);
        
                // Actualizo la reserva
                reservas[index] = { fecha: nuevaFecha, hora: nuevaHora, nombre };
                localStorage.setItem('reservas', JSON.stringify(reservas));
        
                Swal.fire('Turno movido', `Nuevo turno: ${nuevaFecha} a las ${nuevaHora}`, 'success');
                mostrarReservas();
                mostrarTurnos();
                actualizarHoras(turnosDisponibles);
                actualizarCalendario();
        
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo mover el turno.', 'error');
                revertFunc();
            }
        }
        
            
    });

    actualizarCalendario();
}

function actualizarCalendario() {
    const calendar = $('#calendar');
    calendar.fullCalendar('removeEvents');

    const eventos = reservas.map(r => ({
        title: r.nombre,
        start: `${r.fecha}T${r.hora}`,
        allDay: false
    }));

    calendar.fullCalendar('addEventSource', eventos);
}

function toggleCalendario() {
    const contenido = document.getElementById('acordeonCalendario');
    contenido.classList.toggle('activo');
}