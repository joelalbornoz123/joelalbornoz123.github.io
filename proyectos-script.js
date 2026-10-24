document.addEventListener("DOMContentLoaded", () => {
    // 📁 1. BANCO DE IMÁGENES: Aquí guardas todas las fotos de cada proyecto
    // Cada imagen es un objeto con: src (ruta), descripcion (texto opcional), fecha (opcional)
    const imagenesPorProyecto = {
        "residencial-rosario": [
            { src: "img/casa1.avif", descripcion: "Vista frontal de la vivienda", fecha: "Marzo 2024" },
            { src: "img/casa6.avif", descripcion: "Lateral y jardín", fecha: "Marzo 2024" },
            { src: "img/casa7.avif", descripcion: "Detalle de carpintería exterior", fecha: "Abril 2024" },
            { src: "img/residencial-plano.webp", descripcion: "Plano de planta baja", fecha: "" }
        ],
        "estudio-hormigon": [
            { src: "img/casa2.avif", descripcion: "Fachada principal", fecha: "Junio 2024" },
            { src: "img/casa8.avif", descripcion: "Interior — hormigón visto", fecha: "Julio 2024" },
            { src: "img/hormigon-oficinas.webp", descripcion: "Área de oficinas", fecha: "Agosto 2024" }
        ],
        "edificio-inteligente": [
            { src: "img/casa3.avif", descripcion: "Frente del edificio", fecha: "Enero 2025" },
            { src: "img/casa4.avif", descripcion: "Acceso y lobby", fecha: "Febrero 2025" },
            { src: "img/casa5.avif", descripcion: "Unidad tipo — planta alta", fecha: "Marzo 2025" },
            { src: "img/casa9.avif", descripcion: "Terraza comunitaria", fecha: "Abril 2025" },
            { src: "img/edificio-terraza.webp", descripcion: "Vista panorámica desde terraza", fecha: "Mayo 2025" }
        ]
    };

    // 🎛️ 2. Variables de control del visor
    let imagenesActuales = [];
    let indiceActual = 0;

    // 🔍 3. Captura de elementos del HTML
    const modal = document.getElementById("project-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const closeBtn = document.querySelector(".close-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const nextEl = document.querySelector(".next-btn");
    const tarjetas = document.querySelectorAll(".project-card");

    // 📝 Helper: actualiza imagen + caption según el índice actual
    const mostrarImagen = (indice) => {
        const item = imagenesActuales[indice];
        modalImg.src = item.src;

        // Construye el texto del caption combinando descripción y fecha
        const partes = [item.descripcion, item.fecha].filter(Boolean);
        modalCaption.textContent = partes.join(" — ");
        modalCaption.style.display = partes.length > 0 ? "block" : "none";
    };

    // 🚀 4. Función para abrir el modal con el proyecto seleccionado
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            // Lee el atributo data-proyecto que le pusimos en el HTML
            const nombreProyecto = tarjeta.getAttribute("data-proyecto");
            
            // Carga el array de imágenes correspondiente
            imagenesActuales = imagenesPorProyecto[nombreProyecto] || [];
            
            if (imagenesActuales.length > 0) {
                indiceActual = 0; // Arranca siempre en la primera foto
                mostrarImagen(indiceActual);
                modal.classList.add("modal-activo"); // Muestra el modal con CSS
            }
        });
    });

    // 🔄 5. Funciones de navegación (Siguiente / Anterior)
    const mostrarSiguiente = () => {
        indiceActual = (indiceActual + 1) % imagenesActuales.length; // Vuelve a 0 si llega al final
        mostrarImagen(indiceActual);
    };

    const mostrarAnterior = () => {
        indiceActual = (indiceActual - 1 + imagenesActuales.length) % imagenesActuales.length; // Va al final si baja de 0
        mostrarImagen(indiceActual);
    };

    nextEl.addEventListener("click", mostrarSiguiente);
    prevBtn.addEventListener("click", mostrarAnterior);

    // 🛑 6. Cerrar el modal
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("modal-activo");
    });

    // Cerrar si hace clic en el fondo oscuro fuera de la imagen
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("modal-activo");
        }
    });

    // Navegación con las flechas físicas del teclado (Detalle pro)
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("modal-activo")) return;
        if (e.key === "ArrowRight") mostrarSiguiente();
        if (e.key === "ArrowLeft") mostrarAnterior();
        if (e.key === "Escape") modal.classList.remove("modal-activo");
    });

    // 🚀 CONFIGURACIÓN DEL OBSERVADOR (Vigila el scroll)
    const opciones = {
        root: null,       // Utiliza la pantalla del navegador como referencia
        threshold: 0.2    // El elemento debe estar visible al menos en un 20% para activarse
    };

    const observador = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento entra en la pantalla...
            if (entry.isIntersecting) {
                const elementoContador = entry.target;
                animarContador(elementoContador);
                
                // 🛑 IMPORTANTE: Dejamos de vigilar este elemento para que la animación ocurra SOLO UNA VEZ
                observer.unobserve(elementoContador); 
            }
        });
    }, opciones);

    // Le decimos al observador que vigile cada uno de nuestros contadores
    contadores.forEach(contador => observador.observe(contador));
});

// =========================================================================
// NAV — cerrar menú móvil al hacer clic en un enlace
// =========================================================================
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        const toggle = document.getElementById("menu-toggle");
        if (toggle) toggle.checked = false;
    });
});

// Marca el enlace de la página actual como activo
const paginaActualProyectos = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav a").forEach(a => {
    if (a.getAttribute("href") === paginaActualProyectos) a.classList.add("nav-activo");
});
