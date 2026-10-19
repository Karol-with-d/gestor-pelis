export class PeliculaView {
    form;
    titulo;
    anio;
    genero;
    director;
    calificacion;
    comentario;
    botonGuardar;
    botonCancelar;
    formDirector;
    nombreDirector;
    emailDirector;
    botonGuardarDirector;
    botonCancelarDirector;
    buscar;
    filtroGenero;
    filtroAnio;
    filtroEstado;
    ordenar;
    estadisticas;
    lista;
    listaDirectores;
    mensaje;
    pestanas;
    paneles;
    temporizadorMensaje;
    onGuardar = () => { };
    onEliminar = () => { };
    onEditar = () => { };
    onToggle = () => { };
    onFiltrar = () => { };
    onOrdenar = () => { };
    onCancelar = () => { };
    onGuardarDirector = () => { };
    onEliminarDirector = () => { };
    onEditarDirector = () => { };
    onCancelarDirector = () => { };
    constructor() {
        this.form = document.getElementById("form-pelicula");
        this.titulo = document.getElementById("titulo");
        this.anio = document.getElementById("anio");
        this.genero = document.getElementById("genero");
        this.director = document.getElementById("director");
        this.calificacion = document.getElementById("calificacion");
        this.comentario = document.getElementById("comentario");
        this.botonGuardar = document.getElementById("btn-guardar");
        this.botonCancelar = document.getElementById("btn-cancelar");
        this.formDirector = document.getElementById("form-director");
        this.nombreDirector = document.getElementById("nombre-director");
        this.emailDirector = document.getElementById("email-director");
        this.botonGuardarDirector = document.getElementById("btn-guardar-director");
        this.botonCancelarDirector = document.getElementById("btn-cancelar-director");
        this.buscar = document.getElementById("buscar");
        this.filtroGenero = document.getElementById("filtro-genero");
        this.filtroAnio = document.getElementById("filtro-anio");
        this.filtroEstado = document.getElementById("filtro-estado");
        this.ordenar = document.getElementById("ordenar");
        this.estadisticas = document.getElementById("estadisticas");
        this.lista = document.getElementById("lista");
        this.listaDirectores = document.getElementById("lista-directores");
        this.mensaje = document.getElementById("mensaje");
        this.pestanas = document.querySelectorAll(".pestana");
        this.paneles = document.querySelectorAll(".vista-panel");
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.onGuardar(this.obtenerDatosFormulario());
        });
        this.botonCancelar.addEventListener("click", () => {
            this.onCancelar();
        });
        this.formDirector.addEventListener("submit", (event) => {
            event.preventDefault();
            this.onGuardarDirector(this.nombreDirector.value, this.emailDirector.value);
        });
        this.botonCancelarDirector.addEventListener("click", () => {
            this.onCancelarDirector();
        });
        this.buscar.addEventListener("input", () => {
            this.onFiltrar();
        });
        this.filtroGenero.addEventListener("change", () => {
            this.onFiltrar();
        });
        this.filtroAnio.addEventListener("input", () => {
            this.onFiltrar();
        });
        this.filtroEstado.addEventListener("change", () => {
            this.onFiltrar();
        });
        this.ordenar.addEventListener("change", () => {
            this.onOrdenar(this.ordenar.value);
        });
        this.pestanas.forEach((boton) => {
            boton.addEventListener("click", () => {
                this.mostrarPestana(boton.dataset.vista ?? "peliculas");
            });
        });
        this.lista.addEventListener("click", (event) => {
            const boton = event.target.closest("button");
            if (!boton) {
                return;
            }
            const id = Number(boton.dataset.id);
            const accion = boton.dataset.accion;
            if (accion === "eliminar") {
                this.onEliminar(id);
            }
            if (accion === "editar") {
                this.onEditar(id);
            }
            if (accion === "vista") {
                this.onToggle(id);
            }
        });
        this.listaDirectores.addEventListener("click", (event) => {
            const boton = event.target.closest("button");
            if (!boton) {
                return;
            }
            const id = Number(boton.dataset.id);
            const accion = boton.dataset.accion;
            if (accion === "eliminar-director") {
                this.onEliminarDirector(id);
            }
            if (accion === "editar-director") {
                this.onEditarDirector(id);
            }
        });
    }
    renderizar(peliculas) {
        this.lista.innerHTML = "";
        if (peliculas.length === 0) {
            this.lista.innerHTML = "<p>No hay películas para mostrar.</p>";
            return;
        }
        for (const pelicula of peliculas) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta";
            const estado = pelicula.vista ? "Vista" : "Pendiente";
            const claseEstado = pelicula.vista ? "vista" : "pendiente";
            const textoBoton = pelicula.vista ? "Marcar pendiente" : "Marcar vista";
            const comentario = pelicula.comentario.trim() === ""
                ? ""
                : `<p class="comentario">${this.escapar(pelicula.comentario)}</p>`;
            tarjeta.innerHTML = `
                <h2>${this.escapar(pelicula.titulo)}</h2>
                <p>${this.escapar(pelicula.año)} · ${this.escapar(pelicula.genero)}</p>
                <p class="director">Dirección: ${this.escapar(pelicula.directorNombre)}</p>
                <p class="estrellas">${this.renderEstrellas(pelicula.calificacion)}</p>
                ${comentario}
                <p class="${claseEstado}">${estado}</p>
                <button type="button" class="secundario" data-accion="vista" data-id="${pelicula.id}">${textoBoton}</button>
                <button type="button" class="secundario" data-accion="editar" data-id="${pelicula.id}">Editar</button>
                <button type="button" class="peligro" data-accion="eliminar" data-id="${pelicula.id}">Eliminar</button>
            `;
            this.lista.appendChild(tarjeta);
        }
    }
    renderDirectores(directores) {
        this.listaDirectores.innerHTML = "";
        if (directores.length === 0) {
            this.listaDirectores.innerHTML = "<p>No hay directores. Agrega uno para relacionarlo con una película.</p>";
            return;
        }
        for (const director of directores) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta";
            const cantidad = director.titulos.length === 1 ? "1 película" : `${director.titulos.length} películas`;
            const relacionadas = director.titulos.length === 0
                ? "<p>Sin películas asociadas.</p>"
                : `<ul class="relacion">${director.titulos.map((titulo) => `<li>${this.escapar(titulo)}</li>`).join("")}</ul>`;
            tarjeta.innerHTML = `
                <h2>${this.escapar(director.nombre)}</h2>
                <p>${this.escapar(director.email)}</p>
                <p>${cantidad}</p>
                ${relacionadas}
                <button type="button" class="secundario" data-accion="editar-director" data-id="${director.id}">Editar</button>
                <button type="button" class="peligro" data-accion="eliminar-director" data-id="${director.id}">Eliminar</button>
            `;
            this.listaDirectores.appendChild(tarjeta);
        }
    }
    mostrarMensaje(texto, esError) {
        window.clearTimeout(this.temporizadorMensaje);
        this.mensaje.textContent = texto;
        this.mensaje.className = esError ? "mensaje-error" : "mensaje-ok";
        this.temporizadorMensaje = window.setTimeout(() => {
            this.mensaje.textContent = "";
            this.mensaje.className = "";
        }, 3500);
    }
    limpiarFormulario() {
        this.form.reset();
        this.botonGuardar.textContent = "Agregar";
        this.botonCancelar.hidden = true;
    }
    llenarFormulario(pelicula) {
        this.titulo.value = pelicula.titulo;
        this.anio.value = pelicula.año;
        this.genero.value = pelicula.genero;
        this.director.value = pelicula.directorId > 0 ? String(pelicula.directorId) : "";
        this.calificacion.value = pelicula.calificacion > 0 ? String(pelicula.calificacion) : "";
        this.comentario.value = pelicula.comentario;
        this.botonGuardar.textContent = "Actualizar";
        this.botonCancelar.hidden = false;
        this.form.scrollIntoView({ block: "start" });
    }
    limpiarFormularioDirector() {
        this.formDirector.reset();
        this.botonGuardarDirector.textContent = "Agregar";
        this.botonCancelarDirector.hidden = true;
    }
    llenarFormularioDirector(director) {
        this.nombreDirector.value = director.nombre;
        this.emailDirector.value = director.email;
        this.botonGuardarDirector.textContent = "Actualizar";
        this.botonCancelarDirector.hidden = false;
        this.formDirector.scrollIntoView({ block: "start" });
    }
    llenarSelectDirectores(directores) {
        const seleccionado = this.director.value;
        const opciones = directores.map((director) => {
            return `<option value="${director.id}">${this.escapar(director.nombre)}</option>`;
        }).join("");
        this.director.innerHTML = `<option value="">Director</option>${opciones}`;
        this.director.value = seleccionado;
    }
    obtenerDatosFormulario() {
        return {
            titulo: this.titulo.value,
            año: this.anio.value,
            genero: this.genero.value,
            directorId: Number(this.director.value),
            calificacion: Number(this.calificacion.value),
            comentario: this.comentario.value
        };
    }
    obtenerFiltros() {
        return {
            busqueda: this.buscar.value,
            genero: this.filtroGenero.value,
            año: this.filtroAnio.value,
            estado: this.filtroEstado.value
        };
    }
    renderEstrellas(calificacion) {
        if (calificacion < 1 || calificacion > 5) {
            return "Sin calificación";
        }
        return "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
    }
    renderEstadisticas(stats, recomendaciones, top5, totalDirectores) {
        const promedio = stats.promedio === 0 ? "—" : stats.promedio.toFixed(1);
        const recomendacionesHtml = this.renderListaPeliculas(recomendaciones, "No hay recomendaciones todavía. Califica con 4 o 5 estrellas.");
        const topHtml = this.renderListaPeliculas(top5, "Califica películas para ver el top 5.", true);
        this.estadisticas.innerHTML = `
            <div class="numeros">
                <p class="numero"><span>Total</span><strong>${stats.total}</strong></p>
                <p class="numero"><span>Vistas</span><strong>${stats.vistas}</strong></p>
                <p class="numero"><span>Pendientes</span><strong>${stats.pendientes}</strong></p>
                <p class="numero"><span>Promedio</span><strong>${promedio}</strong></p>
                <p class="numero"><span>Directores</span><strong>${totalDirectores}</strong></p>
            </div>
            <div class="bloque">
                <h2>Recomendaciones</h2>
                <p>Películas con 4 o 5 estrellas.</p>
                ${recomendacionesHtml}
            </div>
            <div class="bloque">
                <h2>Top 5</h2>
                ${topHtml}
            </div>
        `;
    }
    mostrarPestana(vista) {
        this.pestanas.forEach((boton) => {
            const activa = boton.dataset.vista === vista;
            boton.classList.toggle("activa", activa);
            boton.setAttribute("aria-selected", activa ? "true" : "false");
        });
        this.paneles.forEach((panel) => {
            panel.hidden = panel.dataset.vista !== vista;
        });
    }
    renderListaPeliculas(peliculas, vacio, numerada = false) {
        if (peliculas.length === 0) {
            return `<p>${vacio}</p>`;
        }
        const items = peliculas.map((pelicula) => {
            return `<li>${this.escapar(pelicula.titulo)} <span class="estrellas">${this.renderEstrellas(pelicula.calificacion)}</span></li>`;
        }).join("");
        const etiqueta = numerada ? "ol" : "ul";
        return `<${etiqueta}>${items}</${etiqueta}>`;
    }
    escapar(texto) {
        return texto
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }
}
