// 🔑 CONEXIÓN A SUPABASE
const supabaseUrl = "https://qvxfwuxfcvjxmawvzioe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eGZ3dXhmY3ZqeG1hd3Z6aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTM2MDUsImV4cCI6MjA3NzkyOTYwNX0.stfGausY-BLG_SA8RBiVo4KJYh2fjcXeEpOL6_cJ5nE";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 👉 ID DEL USUARIO (ejemplo)
const usuarioID = 1;

// 🔥 FUNCIÓN PARA CARGAR PERFIL
async function cargarPerfil() {
    const userId = localStorage.getItem("usuario_id");

    const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, nombre_usuario, correo, rol")
        .eq("id", userId)
        .single();

    if (error) {
        console.error(error.message);
        return;
    }

    document.getElementById("nombre-completo").textContent = data.nombre;
    document.getElementById("correo-usuario").textContent = data.correo;
    document.getElementById("username-field").textContent = data.nombre_usuario;
    document.getElementById("email-field").textContent = data.correo;
    document.getElementById("rol-field").textContent = data.rol;
}

cargarPerfil();

