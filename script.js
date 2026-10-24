window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", () => {
    const contadores = document.querySelectorAll('.contador');
    const velocidad = 130; // 🚀 Ajusta este número para cambiar la rapidez (más bajo = más rápido)

    const animarContador = (contador) => {
        const actualizarContador = () => {
            const valorFinal = +contador.getAttribute('data-target');
            const valorActual = +contador.innerText;
            
            // Calculamos un incremento mínimo de 1 para evitar bucles infinitos en números chicos
            const incremento = Math.ceil(valorFinal / velocidad) || 1;

            if (valorActual < valorFinal) {
                // Si la suma se pasa del valor final, le asignamos directamente el valor final
                if (valorActual + incremento > valorFinal) {
                    contador.innerText = valorFinal;
                } else {
                    contador.innerText = valorActual + incremento;
                    setTimeout(actualizarContador, 25); // Controla los milisegundos entre cada fotograma
                }
            } else {
                contador.innerText = valorFinal;
            }
        };
        actualizarContador();
    };

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


        // 🔍 1. Capturamos los elementos del Formulario
    const formulario = document.querySelector(".form-mail");
    const inputNombre = document.getElementById("nombre");
    const inputTelefono = document.getElementById("telefono");
    const inputMail = document.getElementById("mail");
    const inputMensaje = document.getElementById("mensaje");
    const parrafoError = document.getElementById("error-presupuesto");

    // 📧 Dirección de correo oficial de la constructora
    const emailDestino = "estylocasas@gmail.com";

    // 🛠️ Helper: muestra un error y hace foco en el campo inválido
    const mostrarError = (mensaje, campo) => {
        parrafoError.innerText = mensaje;
        parrafoError.style.color = "rgb(253, 99, 33)";
        campo.focus();
        campo.classList.add("campo-invalido");
    };

    // Limpia el estado de error visual de un campo cuando el usuario empieza a escribir
    [inputNombre, inputTelefono, inputMail, inputMensaje].forEach(campo => {
        campo.addEventListener("input", () => {
            campo.classList.remove("campo-invalido");
            parrafoError.innerText = "";
        });
    });

    // 🚀 2. Escuchamos el evento de envío del formulario
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        parrafoError.innerText = "";
        [inputNombre, inputTelefono, inputMail, inputMensaje].forEach(c => c.classList.remove("campo-invalido"));

        // --- 📋 VALIDACIONES ---

        // Nombre y Apellido: mínimo 5 caracteres, solo letras y espacios, debe tener al menos un espacio (nombre + apellido)
        const nombreLimpio = inputNombre.value.trim();
        const soloLetrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        if (nombreLimpio.length < 5) {
            mostrarError("Ingresá tu nombre y apellido (mínimo 5 caracteres).", inputNombre);
            return;
        }
        if (!soloLetrasYEspacios.test(nombreLimpio)) {
            mostrarError("El nombre solo puede contener letras y espacios.", inputNombre);
            return;
        }
        if (!nombreLimpio.includes(" ")) {
            mostrarError("Ingresá tanto tu nombre como tu apellido.", inputNombre);
            return;
        }

        // Teléfono: solo dígitos, guiones y espacios, entre 7 y 15 dígitos numéricos
        const telefonoLimpio = inputTelefono.value.trim();
        const soloDigitos = telefonoLimpio.replace(/[\s\-]/g, ""); // quita espacios y guiones para contar
        if (!/^[\d\s\-]+$/.test(telefonoLimpio)) {
            mostrarError("El teléfono solo puede contener números, espacios y guiones.", inputTelefono);
            return;
        }
        if (soloDigitos.length < 7 || soloDigitos.length > 15) {
            mostrarError("Ingresá un número de teléfono válido (entre 7 y 15 dígitos).", inputTelefono);
            return;
        }

        // Email: formato estándar
        const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!expresionEmail.test(inputMail.value.trim())) {
            mostrarError("La dirección de email no es válida. Revisá el formato.", inputMail);
            return;
        }

        // Mensaje: mínimo 10 caracteres
        if (inputMensaje.value.trim().length < 10) {
            mostrarError("El mensaje es muy corto. Por favor, danos más detalles de tu proyecto.", inputMensaje);
            return;
        }

        // Mensaje: maximo 300 caracteres
        if (inputMensaje.value.trim().length > 1000) {
            mostrarError(`El mensaje excede el límite de 1000 caracteres (${inputMensaje.value.trim().length}).`);
            return;
        }

        // --- 📨 TODAS LAS VALIDACIONES PASARON → ENVÍO ---

        const asunto = encodeURIComponent(`Consulta Web - ${nombreLimpio}`);
        const cuerpoMensaje = encodeURIComponent(
            `Nombre: ${nombreLimpio}\n` +
            `Teléfono: ${telefonoLimpio}\n` +
            `Email: ${inputMail.value.trim()}\n\n` +
            `Mensaje:\n${inputMensaje.value.trim()}`
        );

        window.location.href = `mailto:${emailDestino}?subject=${asunto}&body=${cuerpoMensaje}`;

        formulario.reset();
        parrafoError.style.color = "#ff5005";
        parrafoError.innerText = "Mensaje enviado";
    });

            document.querySelectorAll(".btn-proyectos").forEach(btn => {
            btn.addEventListener("click", () => {
                const tablaId = btn.getAttribute("data-target");
                const tabla = document.getElementById(tablaId);

                // Cierra cualquier tabla abierta que no sea la actual
                document.querySelectorAll(".tabla-linea-detalle").forEach(t => {
                    if (t.id !== tablaId) t.classList.remove("tabla-visible");
                });

                // Abre/cierra la tabla de este botón
                tabla.classList.toggle("tabla-visible");

                // Cambia el texto del botón
                const abierta = tabla.classList.contains("tabla-visible");
                btn.textContent = abierta ? "Ver menos ↑" : "Ver más ↓";

                // Scroll suave hacia la tabla
                if (abierta) tabla.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });

        // Botones cerrar dentro de cada tabla
        document.querySelectorAll(".btn-cerrar-tabla").forEach(cerrar => {
            cerrar.addEventListener("click", () => {
                const tabla = cerrar.closest(".tabla-linea-detalle");
                tabla.classList.remove("tabla-visible");

                // Restaura el texto del botón correspondiente
                const id = tabla.id;
                const btn = document.querySelector(`.btn-proyectos[data-target="${id}"]`);
                if (btn) btn.textContent = "Ver más ↓";
            });
        });
});

// =========================================================================
// LINEAS — toggle expandir/colapsar cards
// =========================================================================
document.querySelectorAll("#lineas .btn-lineas").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".tarjeta-linea");
        const abierta = card.classList.contains("linea-expandida");
        card.classList.toggle("linea-expandida");
        btn.textContent = abierta ? "Ver más ↓" : "Ver menos ↑";
    });
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

// =========================================================================
// NAV — destacar sección activa según scroll
// =========================================================================
const seccionesNav = [
    { id: "inicio",   selector: 'a[href="#inicio"]' },
    { id: "Nosotros", selector: 'a[href="#Nosotros"]' },
    { id: "lineas",   selector: 'a[href="#lineas"]' },
    { id: "Contacto", selector: 'a[href="#Contacto"]' },
];

const navLinks = document.querySelectorAll(".nav a");

const marcarActivo = (id) => {
    navLinks.forEach(a => a.classList.remove("nav-activo"));
    const match = seccionesNav.find(s => s.id === id);
    if (match) {
        const link = document.querySelector(`.nav ${match.selector}`);
        if (link) link.classList.add("nav-activo");
    }
};

// Marca el enlace de la página actual como activo (útil si se navega desde otra página)
const paginaActual = window.location.pathname.split("/").pop();
navLinks.forEach(a => {
    if (a.getAttribute("href") === paginaActual) a.classList.add("nav-activo");
});

// IntersectionObserver: activa el enlace cuando la sección entra en el área visible
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            marcarActivo(entry.target.id);
        }
    });
}, {
    root: null,
    rootMargin: "-10% 0px -80% 0px",
    threshold: 0
});

seccionesNav.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) navObserver.observe(el);
});
