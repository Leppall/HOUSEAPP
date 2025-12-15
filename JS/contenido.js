const supabaseUrl = "https://qvxfwuxfcvjxmawvzioe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eGZ3dXhmY3ZqeG1hd3Z6aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTM2MDUsImV4cCI6MjA3NzkyOTYwNX0.stfGausY-BLG_SA8RBiVo4KJYh2fjcXeEpOL6_cJ5nE";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);



// 🔥 Cargar usuario logeado en el header
async function cargarUsuarioHeader() {
    const userId = localStorage.getItem("usuario_id");

    if (!userId) {
        // Si no hay sesión → redirigir a login
        window.location.href = "entradalogeo.html";
        return;
    }

    const { data, error } = await supabase
        .from("usuarios")
        .select("nombre, nombre_usuario")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error cargando usuario:", error.message);
        return;
    }

    // 👉 Mostrar nombre en el header
    document.getElementById("nombre-usuario").textContent = data.nombre_usuario;
    
}

// Ejecutar al cargar la página





document.addEventListener('DOMContentLoaded', function() {
    // Obtener el contenedor donde se cargará el contenido
    const contentContainer = document.querySelector('.CLASES');
    
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // Configuración de rutas
    const routes = {
         'inicio': 'inicio.html',
        'seguridad': 'seguridad.html',
        'ajustes': 'ajustes.html',
        'auditoría': 'auditoria.html',
        'perfil': 'perfil.html'
    };
    
    // Función para cargar contenido dinámicamente
    async function loadContent(page) {
        try {
            // Mostrar indicador de carga
            contentContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-3x"></i><p>Cargando...</p></div>';
            
            // Cargar el contenido de la página
            const response = await fetch(`../Vistas/${page}`);
            
            if (!response.ok) {
                throw new Error(`Error al cargar ${page}: ${response.status}`);
            }
            
            const content = await response.text();
            
            // Insertar el contenido en el contenedor
            contentContainer.innerHTML = content;
            
            // Actualizar la clase activa en la navegación
            updateActiveNavigation(page);
            
            // Ejecutar scripts específicos de la página si existen
            executePageScripts(page);
            
        } catch (error) {
            console.error('Error al cargar el contenido:', error);
            contentContainer.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle fa-3x"></i>
                    <h3>Error al cargar el contenido</h3>
                    <p>No se pudo cargar la página: ${page}</p>
                    <button onclick="location.reload()" class="control-btn green-btn">Reintentar</button>
                </div>
            `;
        }
    }
    
    // Función para actualizar la navegación activa
    function updateActiveNavigation(page) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Determinar qué enlace debería estar activo basado en la página
            const linkText = link.querySelector('span')?.textContent.toLowerCase() || '';
            
            if ((page === 'seguridad.html' && linkText === 'seguridad') ||
                (page === 'ajustes.html' && linkText === 'ajustes') ||
                (page === 'auditoria.html' && linkText === 'auditoría')||
                (page === 'perfil.html' && linkText === 'perfil')
            ) {
                link.classList.add('active');
            }
        });
    }
    
    // Función para ejecutar scripts específicos de la página
    function executePageScripts(page) {
        // Eliminar scripts anteriores para evitar conflictos
        const oldScripts = contentContainer.querySelectorAll('script');
        oldScripts.forEach(script => script.remove());
        
        // Cargar y ejecutar el script específico de la página si existe
        const scriptName = page.replace('.html', '.js');
        const scriptPath = `../JS/${scriptName}`;
        
        // Crear elemento script
        const script = document.createElement('script');
        script.src = scriptPath;
        script.onerror = function() {
            console.log(`No se encontró el script: ${scriptPath}`);
        };
        
        // Agregar al contenedor
        contentContainer.appendChild(script);

        
    }
    
    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const linkText = this.querySelector('span')?.textContent.toLowerCase() || '';
            const page = routes[linkText];
            
            if (page) {
                loadContent(page);
                
                // Actualizar URL sin recargar la página
                history.pushState({page: page}, '', `#${page}`);
            }
        });
    });
    
    // Agregar event listener para el logo House/M
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent('inicio.html');
            history.pushState({page: 'inicio.html'}, '', '#inicio.html');
            
            // Quitar clase active de todos los enlaces de navegación
            navLinks.forEach(link => link.classList.remove('active'));
        });
    }
    
    // Manejar navegación con botones de atrás/adelante del navegador
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            loadContent(e.state.page);
        }
    });
    
    
    // Cargar página inicial basada en el hash o por defecto inicio.html
    function loadInitialPage() {
        const hash = window.location.hash.substring(1);
        const initialPage = hash && Object.values(routes).includes(hash) ? hash : 'inicio.html';
        loadContent(initialPage);
    }
    
    // Cargar la página inicial
    loadInitialPage();
    
    // Agregar event listener para el botón de perfil
    const perfilBtn = document.getElementById('btn-perfil');
    if (perfilBtn) {
        perfilBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent('perfil.html');
            history.pushState({page: 'perfil.html'}, '', '#perfil.html');
            
            // Quitar clase active de todos los enlaces de navegación
            navLinks.forEach(link => link.classList.remove('active'));
        });
    }
    
    // Exponer la función loadContent globalmente para uso externo
    window.loadPage = loadContent;

    cargarUsuarioHeader();
});



// cerrar seccion

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "entradalogeo.html";
});
