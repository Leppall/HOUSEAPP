// Restricción de seguridad - verificar acceso legítimo
document.addEventListener('DOMContentLoaded', function() {
    if (window.self === window.top && !window.location.hash) {
        window.location.href = '../Vistas/entradalogeo.html';
        return;
    }
});



// Estado para rastrear qué luces están encendidas
const lucesEstado = {};
const puertasEstado = {};

/* --- FUNCIÓN PARA MANEJAR EL CLICK EN LUCES Y PUERTAS --- */
function toggleEstado(elemento, tipo, id) {
    if (tipo === 'luz') {
        lucesEstado[id] = !lucesEstado[id];
        elemento.classList.toggle('active', lucesEstado[id]);
    } else if (tipo === 'puerta') {
        puertasEstado[id] = !puertasEstado[id];
        elemento.classList.toggle('active', puertasEstado[id]);
    }
}

/* --- FUNCIÓN PARA ENVIAR COMANDO AL ARDUINO --- */
function enviarArduino(c) {
    // Determinar si es una luz (1-6) o puerta (7-8)
    const esLuz = c >= '1' && c <= '6';
    const esPuerta = c >= '7' && c <= '8';
    
    // Obtener el elemento que disparó el evento
    const elementos = document.querySelectorAll('.light-item, .door-item, .control-btn');
    let elementoActual = null;
    
    // Buscar el elemento que coincide con el comando
    elementos.forEach(el => {
        if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${c}'`)) {
            elementoActual = el;
        }
    });
    
    // Si es el botón de apagar todos
    if (c === '0') {
        // Apagar todas las luces visualmente
        document.querySelectorAll('.light-item').forEach(light => {
            light.classList.remove('active');
        });
        // Resetear el estado de las luces
        Object.keys(lucesEstado).forEach(key => {
            lucesEstado[key] = false;
        });
    }
    
    // Si es una luz o puerta individual
    if (elementoActual) {
        const tipo = esLuz ? 'luz' : 'puerta';
        toggleEstado(elementoActual, tipo, c);
    }
    
    // Enviar comando al Arduino
    fetch(`http://localhost:3001/cmd/${c}`)
        .then(res => res.text())
        .then(r => console.log("Arduino:", r))
        .catch(err => console.error("Error:", err));
}
