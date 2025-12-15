// --- Configuración Supabase ---
const supabaseUrl = "https://qvxfwuxfcvjxmawvzioe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eGZ3dXhmY3ZqeG1hd3Z6aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTM2MDUsImV4cCI6MjA3NzkyOTYwNX0.stfGausY-BLG_SA8RBiVo4KJYh2fjcXeEpOL6_cJ5nE";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- FORMULARIOS ---
const formLogin = document.querySelector('.contenidologin form');
const formRegistro = document.querySelector('.contenidoregistro form');

// ========== REGISTRO ==========
formRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const nombre_usuario = document.getElementById('usuario-registro').value.trim();
  const correo = document.getElementById('email').value.trim();
  const contrasena = document.getElementById('password-registro').value.trim();

  if (!nombre || !nombre_usuario || !correo || !contrasena) {
    alert('⚠️ Por favor, completa todos los campos.');
    return;
  }

  const { data, error } = await supabase
    .from('solicitudes_registro')
    .insert([{ 
      nombre, 
      nombre_usuario, 
      correo, 
      contrasena, 
      rol: 'usuario', 
      estado: 'pendiente' 
    }]);

  if (error) {
    console.error('Error al registrar:', error);
    alert('❌ Error al registrar. Intenta de nuevo.');
  } else {
    alert('✅ Registro enviado. Espera aprobación del administrador.');
    formRegistro.reset();
  }
});

// ========== LOGIN ==========
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuarioInput = document.getElementById('usuario-login').value.trim();
  const contrasena = document.getElementById('password-login').value.trim();

  if (!usuarioInput || !contrasena) {
    alert('⚠️ Completa todos los campos.');
    return;
  }

  // Buscar usuario por nombre_usuario o correo
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .or(`nombre_usuario.eq.${usuarioInput},correo.eq.${usuarioInput}`)
    .eq('contrasena', contrasena)
    .maybeSingle();

  if (error) {
    console.error('Error al iniciar sesión:', error);
    alert('❌ Error al iniciar sesión.');
    return;
  }

  if (!data) {
    alert('⚠️ Usuario o contraseña incorrectos, o tu cuenta aún no ha sido aprobada.');
    return;
  }

  // Guardar sesión
  localStorage.setItem('usuarioActual', JSON.stringify(data));
  alert(`✅ Bienvenido, ${data.nombre}!`);

  // Redirigir a inicio.html para todos
  window.location.href = 'contenido.html';
});


// === LOGIN / REGISTRO CON GOOGLE ===

// Botones
const btnGoogleLogin = document.getElementById('btn-google-login');
const btnGoogleRegister = document.getElementById('btn-google-register');

// Función para manejar la sesión después de autenticación con Google
async function handleGoogleAuth() {
  // Verificar si hay una sesión activa
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    console.error('Error al obtener la sesión:', sessionError);
    return;
  }

  // Obtener el perfil del usuario
  const { user } = session;
  
  // Crear objeto de usuario con los datos de Google
  const userData = {
    id: user.id,
    email: user.email,
    nombre: user.user_metadata?.full_name || user.email.split('@')[0],
    nombre_usuario: user.user_metadata?.preferred_username || user.email.split('@')[0],
    avatar: user.user_metadata?.avatar_url || '',
    provider: 'google'
  };

  // Guardar los datos del usuario en localStorage
  localStorage.setItem('usuarioActual', JSON.stringify(userData));
  
  // Redirigir a la página de contenido
  window.location.href = 'contenido.html';
}

// Verificar la autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar si hay un intento de autenticación con Google
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (user) {
    await handleGoogleAuth();
  }
});

// Función para iniciar con Google
async function loginConGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/Vistas/contenido.html',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });

  if (error) {
    console.error('Error al iniciar sesión con Google:', error);
    alert('❌ Error al iniciar sesión con Google.');
  } else {
    console.log('Redirigiendo a Google...');
  }
}

// Función para registrarse con Google
async function registrarConGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/Vistas/contenido.html',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });

  if (error) {
    console.error('Error al registrarse con Google:', error);
    alert('❌ Error al registrarse con Google.');
  } else {
    console.log('Redirigiendo a Google...');
  }
}

// Asignar eventos a los botones
btnGoogleLogin.addEventListener('click', loginConGoogle);
btnGoogleRegister.addEventListener('click', registrarConGoogle);
