// ================================================
//  AJUSTES — PROGRAMACIÓN DE HORARIOS
// ================================================

document.querySelectorAll(".guardar-btn").forEach(btn => {
  btn.addEventListener("click", async () => {

    // Obtener la tarjeta donde se hizo clic
    const card = btn.closest(".card");
    const device = card.getAttribute("data-device");

    // Obtener hora
    const time = card.querySelector(".time-input").value;

    // Obtener modo (Prender / Apagar según el toggle)
    const toggle = card.querySelector(".toggle-mode");
    const action = toggle.checked ? "on" : "off";

    // Validar que se eligió una hora
    if (!time) {
      alert("Selecciona una hora primero");
      return;
    }

    // Crear comando JSON
    const command = {
      device: device,
      action: action,
      time: time
    };

    console.log("Enviando:", command);

    // =======================================================
    //  ENVÍO AL ARDUINO / ESP32 POR WEB SERIAL (si está activo)
    // =======================================================
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const writer = port.writable.getWriter();
      await writer.write(new TextEncoder().encode(JSON.stringify(command) + "\n"));
      writer.releaseLock();

      // Mensaje al usuario
      alert("Hora programada con éxito");

    } catch (err) {
      console.error(err);
      alert("No se pudo enviar al dispositivo. Verifica el USB.");
    }

  });
});

// ================================================
// ESPACIO RESERVADO PARA FUTURAS VALIDACIONES
