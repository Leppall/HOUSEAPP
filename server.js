const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport");

const app = express();
app.use(cors());

// Cambia COM5 por el puerto donde esté tu Arduino
const port = new SerialPort({
  path: "COM5", /* ----------- PUERTO Q SE DEBE CAMBIAR SEGUN EL ARDUINO-*/
  baudRate: 9600
});

port.on("open", () => {
  console.log("Arduino conectado ✨");
});

// --- API: enviar comando ---
app.get("/cmd/:c", (req, res) => {
  const c = req.params.c;

  port.write(c, (err) => {
    if (err) return res.status(500).send("Error enviando comando");
    res.send("OK");
  });
});

app.listen(3001, () => console.log("Servidor listo en http://localhost:3001"));
