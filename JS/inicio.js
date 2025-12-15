
// Importar funciones de autenticación
import { isUserLoggedIn, logout, getCurrentUser } from './auth.js';

// Función para actualizar la interfaz de usuario con la información del usuario
function updateUserUI() {
    const user = getCurrentUser();
    if (user) {
        const usernameElement = document.getElementById('nombre-usuario');
        if (usernameElement) {
            usernameElement.textContent = user.nombre || user.nombre_usuario || 'Usuario';
        }
    }
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Actualizar la interfaz de usuario con la información del usuario
    updateUserUI();
    
    // Configurar botón de cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Función para actualizar la imagen según la categoría
    function updateMainImage(category) {
      const container = document.querySelector('.main-image-container');
      let imageUrl = '';
      
      switch(category) {
        case 'todos':
          imageUrl = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
          // Reemplazar con: img/todos.jpg
          break;
        case 'cuartos':
          imageUrl = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
          // Reemplazar con: img/cuartos.jpg
          break;
        case 'otros':
          imageUrl = 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
          // Reemplazar con: img/otros.jpg
          break;
      }
      
      container.innerHTML = `<img src="${imageUrl}" alt="${category}" class="main-image">`;
    }

    // Función para manejar el cambio de categoría
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Remover clase active de todos los botones
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        this.classList.add('active');
        
        // Obtener la categoría seleccionada
        const category = this.getAttribute('data-category');
        
        // Mostrar/ocultar secciones según la categoría
        if (category === 'todos') {
          document.querySelectorAll('.room-category').forEach(section => {
            section.style.display = 'block';
          });
        } else if (category === 'cuartos') {
          document.getElementById('cuartos-section').style.display = 'block';
          document.getElementById('otros-section').style.display = 'none';
        } else if (category === 'otros') {
          document.getElementById('cuartos-section').style.display = 'none';
          document.getElementById('otros-section').style.display = 'block';
        }
        
        // Actualizar la imagen principal
        updateMainImage(category);
      });
    });

    // Mostrar todas las secciones por defecto
    document.addEventListener('DOMContentLoaded', () => {
      // Activar el primer botón de categoría (Todos)
      const defaultCategory = 'todos';
      document.querySelector(`.category-btn[data-category="${defaultCategory}"]`).click();
      updateMainImage(defaultCategory);
    });


    /*---*/
const roomActions = {
  'cuarto': [
    { icon: 'lightbulb', name: 'Luz Principal', type: 'switch', checked: true },
    { icon: 'snowflake', name: 'Aire Acondicionado', type: 'temperature', value: 24, unit: '°C', online: true }
  ],
  'cocina': [
    { icon: 'lightbulb', name: 'Luz Principal', type: 'switch', checked: true },
    { icon: 'microphone', name: 'Micrófono', type: 'switch', checked: false },
    { icon: 'snowflake', name: 'Aire Acondicionado', type: 'temperature', value: 22, unit: '°C', online: true }
  ],
  'garaje': [
    { icon: 'lightbulb', name: 'Luz Principal', type: 'switch', checked: true },
    { icon: 'microphone', name: 'Micrófono', type: 'switch', checked: false },
    { icon: 'door-closed', name: 'Puerta Principal', type: 'status', status: 'Cerrada', online: true }
  ],
  'sala': [
    { icon: 'lightbulb', name: 'Luz Principal', type: 'switch', checked: false },
    { icon: 'microphone', name: 'Micrófono', type: 'switch', checked: false },
    { icon: 'snowflake', name: 'Aire Acondicionado', type: 'temperature', value: 22, unit: '°C', online: true }
  ],
  'baño': [
    { icon: 'lightbulb', name: 'Luz Principal', type: 'switch', checked: false },
    { icon: 'wind', name: 'Ventilador', type: 'status', status: 'Apagado', online: false }
  ],
  'afuera': [
    { icon: 'lightbulb', name: 'Luz Principal', type: 'switch', checked: true },
    { icon: 'video', name: 'Cámara de Seguridad', type: 'switch', checked: true },
    { icon: 'microphone', name: 'Micrófono', type: 'switch', checked: false }
  ]
};

// Función para mostrar el panel de acciones
function showActionsPanel(roomId, roomName) {
  const panel = document.getElementById('actionsPanel');
  const title = document.getElementById('roomTitle');
  const content = document.getElementById('actionsContent');
  
  // Actualizar título
  title.textContent = roomName;
  
  // Limpiar contenido anterior
  content.innerHTML = '';
  
  // Obtener acciones para la habitación
  const actions = roomActions[roomId] || [];
  
  // Agregar acciones al panel
  actions.forEach(action => {
    const control = document.createElement('div');
    control.className = 'device-control';
    
    if (action.type === 'switch') {
      control.innerHTML = `
        <div class="device-info">
          <i class="fas fa-${action.icon}"></i>
          <span>${action.name}</span>
        </div>
        <label class="switch">
          <input type="checkbox" ${action.checked ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      `;
    } else if (action.type === 'status') {
      control.innerHTML = `
        <div class="device-info">
          <i class="fas fa-${action.icon}"></i>
          <span>${action.name}</span>
        </div>
        <span class="status-badge ${action.online ? 'online' : 'offline'}">${action.status}</span>
      `;
    } else if (action.type === 'temperature') {
      control.innerHTML = `
        <div class="device-info">
          <i class="fas fa-${action.icon}"></i>
          <span>${action.name}</span>
        </div>
        <div class="temperature-wrapper">
          <div class="temperature-control ${!action.online ? 'disabled' : ''}">
            <button class="temp-btn" data-action="decrease" ${!action.online ? 'disabled' : ''}>-</button>
            <span class="temp-value">${action.value}${action.unit}</span>
            <button class="temp-btn" data-action="increase" ${!action.online ? 'disabled' : ''}>+</button>
          </div>
          <label class="switch">
            <input type="checkbox" ${action.online ? 'checked' : ''}>
            <span class="slider round"></span>
          </label>
        </div>
      `;
    }
    
    content.appendChild(control);
  });
  
  // Mostrar panel
  panel.classList.add('active');
  
  // Agregar funcionalidad a los botones de temperatura (solo visual)
  document.querySelectorAll('.temp-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tempControl = this.closest('.temperature-control');
      if (tempControl.classList.contains('disabled')) return;
      
      const action = this.getAttribute('data-action');
      const tempDisplay = tempControl.querySelector('.temp-value');
      let currentTemp = parseInt(tempDisplay.textContent);
      
      if (action === 'increase' && currentTemp < 30) {
        currentTemp++;
      } else if (action === 'decrease' && currentTemp > 16) {
        currentTemp--;
      }
      
      tempDisplay.textContent = currentTemp + '°C';
    });
  });

  // Agregar funcionalidad al interruptor de encendido/apagado
  document.querySelectorAll('.temperature-wrapper .switch input').forEach(switchInput => {
    switchInput.addEventListener('change', function() {
      const temperatureControl = this.closest('.temperature-wrapper').querySelector('.temperature-control');
      const tempButtons = temperatureControl.querySelectorAll('.temp-btn');
      
      if (this.checked) {
        temperatureControl.classList.remove('disabled');
        tempButtons.forEach(btn => btn.disabled = false);
      } else {
        temperatureControl.classList.add('disabled');
        tempButtons.forEach(btn => btn.disabled = true);
      }
    });
  });
}

// Cerrar panel al hacer clic en la X
document.querySelector('.close-panel')?.addEventListener('click', () => {
  document.getElementById('actionsPanel').classList.remove('active');
});

// Cerrar panel al hacer clic fuera de él
document.addEventListener('click', (e) => {
  const panel = document.getElementById('actionsPanel');
  if (panel && !panel.contains(e.target) && !e.target.closest('.room-btn')) {
    panel.classList.remove('active');
  }
});

// Asignar evento de clic a los botones de habitación
document.querySelectorAll('.room-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const roomId = btn.getAttribute('data-room');
    const roomName = btn.querySelector('span').textContent;
    showActionsPanel(roomId, roomName);
  });
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Activar el primer botón de categoría (Todos)
  document.querySelector('.category-btn[data-category="todos"]')?.click();
});
 




// Detectar sesión de Google -----------------
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (session) {
    const user = session.user;
    console.log('Usuario autenticado con Google:', user);
    localStorage.setItem('usuarioActual', JSON.stringify(user));

    // Mostrar nombre en pantalla si quieres
    const nombre = user.user_metadata.full_name || user.email;
    document.getElementById('nombre-usuario').textContent = nombre;
  } else {
    console.log('No hay sesión activa.');
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  // --- Inicializar Supabase ---
  const supabaseUrl = "https://qvxfwuxfcvjxmawvzioe.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eGZ3dXhmY3ZqeG1hd3Z6aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTM2MDUsImV4cCI6MjA3NzkyOTYwNX0.stfGausY-BLG_SA8RBiVo4KJYh2fjcXeEpOL6_cJ5nE";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // --- Verificar sesión (Google o local) ---
  const { data: { session }, error } = await supabase.auth.getSession();
  let nombreUsuario = 'Usuario';

  if (session?.user) {
    const user = session.user;
    nombreUsuario = user.user_metadata?.full_name || user.email;
    localStorage.setItem('usuarioActual', JSON.stringify(user));
  } else {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuarioActual'));
    if (usuarioLocal) {
      nombreUsuario = usuarioLocal.nombre || usuarioLocal.nombre_usuario || usuarioLocal.correo || 'Usuario';
    }
  }

  // 🔹 Mostrar nombre en pantalla
  const nombreElemento = document.getElementById('nombre-usuario');
  if (nombreElemento) nombreElemento.textContent = nombreUsuario;

  console.log('Nombre mostrado:', nombreUsuario);
});

