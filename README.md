# Simulador de Gestor de Turnos

## Descripcion

**Gestor de Turnos** es una aplicacion web interactiva que simula un sistema de gestion de turnos para emprendimientos. Permite iniciar sesion, visualizar turnos disponibles, reservar, cancelar y gestionar las reservas a traves de un calendario.  
Este proyecto fue desarrollado como parte del **Proyecto Final del curso de JavaScript** de **CoderHouse**.

---

## Como usar la aplicacion

1. **Iniciar la aplicacion desde**: `login.html`
2. **Credenciales de acceso**:
   - **Usuario:** `admin@gestor.com`
   - **Contraseña:** `123456`
3. **Pasos para probar el simulador**:
   - Iniciar sesion con las credenciales anteriores.
   - Visualizar las fechas y horarios de turnos disponibles.
   - Reservar un turno:
     - Seleccionar una fecha.
     - Seleccionar una hora.
     - Ingresar nombre.
     - Confirmar reserva.
   - Visualizar los turnos:
     - En la seccion **Turnos Reservados**.
     - En el **Calendario Interactivo**.
   - Cancelar turnos desde **Turnos Reservados**.
   - Reasignar turnos arrastrando eventos directamente en el **calendario**.
   - Al final de la pagina, se encuentra un boton para **limpiar el Local Storage**, util para reiniciar el simulador para nuevas pruebas.

---

## Tecnologias y librerias utilizadas

- **HTML**
- **CSS**
- **JavaScript (JS)**
- **JSON (como base de datos simulada)**
- [**FullCalendar**](https://fullcalendar.io/)
- [**SweetAlert2**](https://sweetalert2.github.io/)
- [**Font Awesome**](https://fontawesome.com/)

---

## ℹInformacion adicional

- Todo el contenido dinamico del simulador (turnos, calendario, etc.) es generado desde JavaScript utilizando manipulacion del DOM.
- El archivo `turnos.json` actua como base de datos simulada accedida via `fetch`.

---

## Autor

**Samuel Oliva**  
Proyecto Final - Curso de JavaScript  
**CoderHouse - 2025**

