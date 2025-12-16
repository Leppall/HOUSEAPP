// ==================================================
//  AJUSTES — PROGRAMACIÓN DE HORARIOS (FRONTEND)
// ==================================================

// Guarda todas las programaciones activas
const programaciones = [];

// Recorre todas las tarjetas
document.querySelectorAll(".guardar-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    // Tarjeta actual
    const card = btn.closest(".card");

    // Dispositivo asociado a la tarjeta (1,2,3...)
    const device = card.getAttribute("data-device");

    // Hora seleccionada
    const time = card.querySelector(".time-input").value;

    // Toggle (solo informativo)
    const toggle = card.querySelector(".toggle-mode");
    const action = toggle && toggle.checked ? "on" : "off";

    // Validación
    if (!time) {
      alert("Selecciona una hora primero");
      return;
    }

    // Guardar programación
    const tarea = {
      device,
      time,
      action,
      ejecutado: false
    };

    programaciones.push(tarea);

    console.log("Horario programado:", tarea);
    alert(`Horario guardado para el dispositivo ${device}`);
  });
});

// ==================================================
//  REVISIÓN CONSTANTE DE LA HORA (RELOJ)
// ==================================================
setInterval(() => {
  const now = new Date();
  const horaActual =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  programaciones.forEach(tarea => {
    if (!tarea.ejecutado && tarea.time === horaActual) {

      console.log(`Ejecutando /cmd/${tarea.device}`);

      // ============================================
      // MISMA LÓGICA QUE inicio.js
      // ============================================
      fetch(`http://localhost:3001/cmd/${tarea.device}`)
        .then(res => res.text())
        .then(r => console.log("Arduino:", r))
        .catch(err => console.error("Error:", err));

      tarea.ejecutado = true; // evita repetir
    }
  });

}, 1000); // revisa cada segundo

// ===== MOSTRAR / OCULTAR PANEL DE HORA =====
document.querySelectorAll(".action-select").forEach(select => {
  select.addEventListener("change", () => {
    const card = select.closest(".card");
    const panelHora = card.querySelector(".time-panel");

    if (select.value === "") {
      panelHora.style.display = "none";
    } else {
      panelHora.style.display = "block";
    }
  });
});

// ===== GUARDAR PROGRAMACIÓN =====
document.querySelectorAll(".guardar-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    const card = btn.closest(".card");
    const device = card.dataset.device;
    const accion = card.querySelector(".action-select").value;
    const hora = card.querySelector(".time-input").value;
    const status = card.querySelector(".status");

    if (!accion) {
      status.textContent = "Selecciona encender o apagar";
      return;
    }

    if (!hora) {
      status.textContent = "Selecciona una hora";
      return;
    }

    // Guardado local (lógica web)
    const programacion = {
      device,
      accion,
      hora
    };

    localStorage.setItem(`horario-${device}`, JSON.stringify(programacion));

    status.textContent = `Programado para ${accion} a las ${hora}`;
  });
});

