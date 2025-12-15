// ===== Obtener usuario logueado =====
const usuarioLocal = localStorage.getItem("usuarioActual");

if (!usuarioLocal) {
    window.location.href = "entradalogeo.html";
}

const usuario = JSON.parse(usuarioLocal);

// ===== Cargar datos del perfil =====
async function cargarPerfil() {

    const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, nombre_usuario, correo, rol")
        .eq("id", usuario.id)
        .single();

    if (error) {
        console.error("Error cargando perfil:", error);
        return;
    }

    // Cargar datos en el HTML
    document.getElementById("nombre-completo").textContent = data.nombre;
    document.getElementById("correo-usuario").textContent = data.correo;

    document.getElementById("username-field").value = data.nombre_usuario;
    document.getElementById("email-field").value = data.correo;
    document.getElementById("rol-field").textContent = data.rol || "Usuario";
}

// Ejecutar la carga de perfil
cargarPerfil();

// ===== Botón de Editar =====
let editando = false;

document.getElementById("btn-editar").addEventListener("click", async () => {
    const campos = ["username-field", "email-field"]; // Campos editables

    if (!editando) {
        // Activar los campos para edición
        campos.forEach(id => document.getElementById(id).disabled = false);
        document.getElementById("btn-editar").innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        editando = true;
    } else {
        // Guardar los cambios
        await guardarPerfil();
        campos.forEach(id => document.getElementById(id).disabled = true);
        document.getElementById("btn-editar").innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
        editando = false;
    }
});

// ===== Función para guardar perfil =====
async function guardarPerfil() {

    const updates = {
        nombre_usuario: document.getElementById("username-field").value,
        correo: document.getElementById("email-field").value,
    };

    const { error } = await supabase
        .from("usuarios")
        .update(updates)
        .eq("id", usuario.id);

    if (error) {
        console.error(error);
        alert("❌ Error al guardar cambios");
        return;
    }

    alert("✅ Perfil actualizado correctamente");

    // Actualizar localStorage con los nuevos datos
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    usuarioActual.nombre_usuario = updates.nombre_usuario;
    usuarioActual.correo = updates.correo;
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

    // Recargar perfil para mostrar los cambios
    cargarPerfil();
}
