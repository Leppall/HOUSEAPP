// =============================
// 🔹 CONFIGURACIÓN SUPABASE
// =============================
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://qvxfwuxfcvjxmawvzioe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eGZ3dXhmY3ZqeG1hd3Z6aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTM2MDUsImV4cCI6MjA3NzkyOTYwNX0.stfGausY-BLG_SA8RBiVo4KJYh2fjcXeEpOL6_cJ5nE";

const supabase = createClient(supabaseUrl, supabaseKey);

// =============================
// 🔹 TABLA
// =============================
const tabla = document.querySelector("#tablaSolicitudes");

// =============================
// 🔹 CARGAR SOLICITUDES
// =============================
async function cargarSolicitudes() {

    const { data, error } = await supabase
        .from("solicitudes_registro")
        .select("*")
        .eq("estado", "pendiente");

    tabla.innerHTML = "";

    if (error) {
        console.error("❌ Error cargando solicitudes:", error);
        tabla.innerHTML = `<tr><td colspan="4" class="empty">Error al cargar solicitudes</td></tr>`;
        return;
    }

    if (!data || data.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" class="empty">No hay solicitudes pendientes</td></tr>`;
        return;
    }

    data.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.nombre}</td>
            <td>${s.correo}</td>
            <td>${s.contrasena}</td>
            <td>
                <button class="btn aprobar" onclick="aprobar(${s.id})">Aprobar</button>
                <button class="btn rechazar" onclick="rechazar(${s.id})">Rechazar</button>
            </td>
        `;
        tabla.appendChild(row);
    });
}

// =============================
// 🔹 APROBAR SOLICITUD
// =============================
window.aprobar = async (id) => {

    const { error } = await supabase
        .from("solicitudes_registro")
        .update({ estado: "aprobado" })
        .eq("id", id);

    if (error) {
        console.error("❌ Error al aprobar solicitud:", error);
        alert("❌ Error al aprobar.");
        return;
    }

    alert("✅ Solicitud aprobada y usuario creado automáticamente.");
    cargarSolicitudes();
};

// =============================
// 🔹 RECHAZAR SOLICITUD
// =============================
window.rechazar = async (id) => {

    const { error } = await supabase
        .from("solicitudes_registro")
        .update({ estado: "rechazado" })
        .eq("id", id);

    if (error) {
        console.error("❌ Error al rechazar:", error);
        alert("❌ Error al rechazar solicitud.");
        return;
    }

    alert("🚫 Solicitud rechazada.");
    cargarSolicitudes();
};

// =============================
// 🔹 INICIO AUTOMÁTICO
// =============================
cargarSolicitudes();
