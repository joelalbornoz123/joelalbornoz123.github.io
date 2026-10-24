const formPresupuesto = document.getElementById("presupuesto-form");
const inputMetrosCuadrados = document.getElementById("metros-cuadrados");
const selectLineaConstruccion = document.getElementById("linea-construccion");
const resultadoPresupuesto = document.getElementById("resultado");
const datosPresupuesto = document.getElementById("datos-presupuesto");
const errorPresupuesto = document.getElementById("error-presupuesto");

const precios = {
  gris:     799000,
  premium:  1190000,
  inteligente:    1350000
};

const lineasNombre = {
  gris: "Obra Gris",
  premium: "Premium",
  inteligente: "Inteligente"
};

const formatoMoneda = (value) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
};

document.addEventListener("submit", (event) => {
    event.preventDefault();

    const metrosCuadrados = Number(inputMetrosCuadrados.value);
    const lineaConstruccion = selectLineaConstruccion.value;

    if(!metrosCuadrados || metrosCuadrados <= 0){
        errorPresupuesto.textContent = "Ingresá una cantidad válida y volvé a intentar.";

        return;
    }

    if(!selectLineaConstruccion || !precios[lineaConstruccion]){
        errorPresupuesto.textContent = "Seleccioná una línea de construcción.";

        return;
    }

    const precioMetroCuadrado = precios[lineaConstruccion];
    const totalPresupuesto = metrosCuadrados * precioMetroCuadrado;

    resultadoPresupuesto.innerHTML = 
    `<i class="fa-solid fa-circle-check result-icon"></i>
    <p>Presupuesto para línea: ${lineasNombre[lineaConstruccion]}</p>
    <div class= "total">
        ${formatoMoneda(totalPresupuesto)}
    </div>
    
    `;

    datosPresupuesto.innerHTML = 
    `
    <p>
        ${metrosCuadrados.toLocaleString("es-AR")} m² ×
        ${formatoMoneda(precioMetroCuadrado)}
    </p>
    `;

});


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", () => {
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
const paginaActualPresupuestos = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav a").forEach(a => {
    if (a.getAttribute("href") === paginaActualPresupuestos) a.classList.add("nav-activo");
});

// =========================================================================
// PLANES — toggle expandir/colapsar cards
// =========================================================================
document.querySelectorAll(".btn-lineas").forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".tarjeta-plan");
        const abierta = card.classList.contains("plan-expandido");
        card.classList.toggle("plan-expandido");
        btn.textContent = abierta ? "Ver más ↓" : "Ver menos ↑";
    });
});
