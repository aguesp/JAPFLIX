const URL="https://japceibal.github.io/japflix_api/movies-data.json"
const btnBuscar = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const lista = document.getElementById("lista");
let peliculas = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch(URL);
    peliculas = await respuesta.json();
    console.log("Películas cargadas:", peliculas.length);
  } catch (error) {
    console.error("Error al cargar películas:", error);
  }
});
btnBuscar.addEventListener("click", () => {
  const busqueda = inputBuscar.value.trim().toLowerCase();

  if (busqueda === "") {
    alert("Por favor, ingresa un texto para buscar.");
    return;
  }
// Filtrar películas según título, género, tagline u overview
  const resultados = peliculas.filter(p =>
    p.title.toLowerCase().includes(busqueda) ||
    p.genres.join(", ").toLowerCase().includes(busqueda) ||
    (p.tagline && p.tagline.toLowerCase().includes(busqueda)) ||
    (p.overview && p.overview.toLowerCase().includes(busqueda))
  );

  mostrarPeliculas(resultados);
});

// ======== Mostrar películas encontradas ========
function mostrarPeliculas(array) {
  lista.innerHTML = "";

  if (array.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-center bg-secondary text-light">No se encontraron resultados</li>`;
    return;
  }

  array.forEach(pelicula => {
    const item = document.createElement("li");
    item.classList.add("list-group-item", "bg-dark", "text-light", "border-light", "mb-2");
    item.style.cursor = "pointer";

    item.innerHTML = `
      <h5>${pelicula.title}</h5>
      <p class="text-muted">${pelicula.tagline || "Sin descripción"}</p>
      <p>${mostrarEstrellas(pelicula.vote_average)}</p>
    `;

    item.addEventListener("click", () => mostrarDetalles(pelicula));

    lista.appendChild(item);
  });
}

// ======== Función para mostrar estrellas ========
function mostrarEstrellas(promedio) {
  const estrellas = Math.round(promedio / 2); // convierte 10 -> 5 estrellas
  let html = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= estrellas) {
      html += `<span class="fa fa-star checked text-warning"></span>`;
    } else {
      html += `<span class="fa fa-star text-secondary"></span>`;
    }
  }
  return html;
}

// ======== Mostrar detalles de película ========
function mostrarDetalles(p) {
  // Creamos un offcanvas de Bootstrap dinámico
  const offcanvasHTML = `
  <div class="offcanvas offcanvas-top text-bg-dark" tabindex="-1" id="offcanvasPelicula">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">${p.title}</h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <p>${p.overview}</p>
      <p><strong>Géneros:</strong> ${p.genres.map(g => g.name).join(", ")}</p>
      <div class="dropdown mt-3">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
          Más información
        </button>
        <ul class="dropdown-menu">
          <li class="dropdown-item"><strong>Año:</strong> ${p.release_date.split("-")[0]}</li>
          <li class="dropdown-item"><strong>Duración:</strong> ${p.runtime} min</li>
          <li class="dropdown-item"><strong>Presupuesto:</strong> $${p.budget.toLocaleString()}</li>
          <li class="dropdown-item"><strong>Ganancias:</strong> $${p.revenue.toLocaleString()}</li>
        </ul>
      </div>
    </div>
  </div>
  `;

  // Si ya hay uno abierto, eliminarlo
  const previo = document.getElementById("offcanvasPelicula");
  if (previo) previo.remove();

  document.body.insertAdjacentHTML("beforeend", offcanvasHTML);

  const offcanvas = new bootstrap.Offcanvas(document.getElementById("offcanvasPelicula"));
  offcanvas.show();
  }