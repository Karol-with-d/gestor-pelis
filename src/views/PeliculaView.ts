import type { Director } from "../models/Directores.js";
import type { DatosPelicula, Estadisticas, Pelicula } from "../models/Peliculas.js";

type PeliculaEnLista = Pelicula & { directorNombre: string };
type DirectorEnLista = Director & { titulos: string[] };

export class PeliculaView {
    private form: HTMLFormElement;
    private titulo: HTMLInputElement;
    private anio: HTMLInputElement;
    private genero: HTMLSelectElement;
    private director: HTMLSelectElement;
    private calificacion: HTMLSelectElement;
    private comentario: HTMLInputElement;
    private botonGuardar: HTMLButtonElement;
    private botonCancelar: HTMLButtonElement;
    private formDirector: HTMLFormElement;
    private nombreDirector: HTMLInputElement;
    private emailDirector: HTMLInputElement;
    private botonGuardarDirector: HTMLButtonElement;
    private botonCancelarDirector: HTMLButtonElement;
    private buscar: HTMLInputElement;
    private filtroGenero: HTMLSelectElement;
    private filtroAnio: HTMLInputElement;
    private filtroEstado: HTMLSelectElement;
    private ordenar: HTMLSelectElement;
    private estadisticas: HTMLElement;
    private lista: HTMLElement;
    private listaDirectores: HTMLElement;
    private mensaje: HTMLElement;
    private pestanas: NodeListOf<HTMLButtonElement>;
    private paneles: NodeListOf<HTMLElement>;
    private temporizadorMensaje: number | undefined;

    constructor() {
        this.form = document.getElementById("form-pelicula") as HTMLFormElement;
        this.titulo = document.getElementById("titulo") as HTMLInputElement;
        this.anio = document.getElementById("anio") as HTMLInputElement;
        this.genero = document.getElementById("genero") as HTMLSelectElement;
        this.director = document.getElementById("director") as HTMLSelectElement;
        this.calificacion = document.getElementById("calificacion") as HTMLSelectElement;
        this.comentario = document.getElementById("comentario") as HTMLInputElement;
        this.botonGuardar = document.getElementById("btn-guardar") as HTMLButtonElement;
        this.botonCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement;
        this.formDirector = document.getElementById("form-director") as HTMLFormElement;
        this.nombreDirector = document.getElementById("nombre-director") as HTMLInputElement;
        this.emailDirector = document.getElementById("email-director") as HTMLInputElement;
        this.botonGuardarDirector = document.getElementById("btn-guardar-director") as HTMLButtonElement;
        this.botonCancelarDirector = document.getElementById("btn-cancelar-director") as HTMLButtonElement;
        this.buscar = document.getElementById("buscar") as HTMLInputElement;
        this.filtroGenero = document.getElementById("filtro-genero") as HTMLSelectElement;
        this.filtroAnio = document.getElementById("filtro-anio") as HTMLInputElement;
        this.filtroEstado = document.getElementById("filtro-estado") as HTMLSelectElement;
        this.ordenar = document.getElementById("ordenar") as HTMLSelectElement;
        this.estadisticas = document.getElementById("estadisticas") as HTMLElement;
        this.lista = document.getElementById("lista") as HTMLElement;
        this.listaDirectores = document.getElementById("lista-directores") as HTMLElement;
        this.mensaje = document.getElementById("mensaje") as HTMLElement;
        this.pestanas = document.querySelectorAll<HTMLButtonElement>(".pestana");
        this.paneles = document.querySelectorAll<HTMLElement>(".vista-panel");

        this.pestanas.forEach((boton) => {
            boton.addEventListener("click", () => {
                this.mostrarPestana(boton.dataset.vista ?? "peliculas");
            });
        });
    }

    public bindGuardar(handler: (datos: DatosPelicula) => void): void {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            handler(this.obtenerDatosFormulario());
        });
    }

    public bindCancelar(handler: () => void): void {
        this.botonCancelar.addEventListener("click", () => {
            handler();
        });
    }

    public bindGuardarDirector(handler: (nombre: string, email: string) => void): void {
        this.formDirector.addEventListener("submit", (event) => {
            event.preventDefault();
            handler(this.nombreDirector.value.trim(), this.emailDirector.value.trim());
        });
    }

    public bindCancelarDirector(handler: () => void): void {
        this.botonCancelarDirector.addEventListener("click", () => {
            handler();
        });
    }

    public bindFiltrar(handler: () => void): void {
        this.buscar.addEventListener("input", () => {
            handler();
        });
        this.filtroGenero.addEventListener("change", () => {
            handler();
        });
        this.filtroAnio.addEventListener("input", () => {
            handler();
        });
        this.filtroEstado.addEventListener("change", () => {
            handler();
        });
    }

    public bindOrdenar(handler: (criterio: string) => void): void {
        this.ordenar.addEventListener("change", () => {
            handler(this.ordenar.value);
        });
    }

    public bindAccionesPelicula(handlers: {
        eliminar: (id: number) => void;
        editar: (id: number) => void;
        toggle: (id: number) => void;
    }): void {
        this.lista.addEventListener("click", (event) => {
            const boton = (event.target as HTMLElement).closest("button");
            if (!boton) {
                return;
            }

            const id = Number(boton.dataset.id);
            const accion = boton.dataset.accion;

            if (accion === "eliminar") {
                handlers.eliminar(id);
            }
            if (accion === "editar") {
                handlers.editar(id);
            }
            if (accion === "vista") {
                handlers.toggle(id);
            }
        });
    }

    public bindAccionesDirector(handlers: {
        eliminar: (id: number) => void;
        editar: (id: number) => void;
    }): void {
        this.listaDirectores.addEventListener("click", (event) => {
            const boton = (event.target as HTMLElement).closest("button");
            if (!boton) {
                return;
            }

            const id = Number(boton.dataset.id);
            const accion = boton.dataset.accion;

            if (accion === "eliminar-director") {
                handlers.eliminar(id);
            }
            if (accion === "editar-director") {
                handlers.editar(id);
            }
        });
    }

    public renderizar(peliculas: PeliculaEnLista[]): void {
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

    public renderDirectores(directores: DirectorEnLista[]): void {
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

    public mostrarMensaje(texto: string, esError: boolean): void {
        window.clearTimeout(this.temporizadorMensaje);
        this.mensaje.textContent = texto;
        this.mensaje.className = esError ? "mensaje-error" : "mensaje-ok";
        this.temporizadorMensaje = window.setTimeout(() => {
            this.mensaje.textContent = "";
            this.mensaje.className = "";
        }, 3500);
    }

    public limpiarFormulario(): void {
        this.form.reset();
        this.botonGuardar.textContent = "Agregar";
        this.botonCancelar.hidden = true;
    }

    public llenarFormulario(pelicula: Pelicula): void {
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

    public limpiarFormularioDirector(): void {
        this.formDirector.reset();
        this.botonGuardarDirector.textContent = "Agregar";
        this.botonCancelarDirector.hidden = true;
    }

    public llenarFormularioDirector(director: Director): void {
        this.nombreDirector.value = director.nombre;
        this.emailDirector.value = director.email;
        this.botonGuardarDirector.textContent = "Actualizar";
        this.botonCancelarDirector.hidden = false;
        this.formDirector.scrollIntoView({ block: "start" });
    }

    public llenarSelectDirectores(directores: Director[]): void {
        const seleccionado = this.director.value;
        const opciones = directores.map((director) => {
            return `<option value="${director.id}">${this.escapar(director.nombre)}</option>`;
        }).join("");

        this.director.innerHTML = `<option value="">Director</option>${opciones}`;
        this.director.value = seleccionado;
    }

    public obtenerDatosFormulario(): DatosPelicula {
        return {
            titulo: this.titulo.value,
            año: this.anio.value,
            genero: this.genero.value,
            directorId: Number(this.director.value),
            calificacion: Number(this.calificacion.value),
            comentario: this.comentario.value
        };
    }

    public obtenerFiltros(): { busqueda: string; genero: string; año: string; estado: string } {
        return {
            busqueda: this.buscar.value,
            genero: this.filtroGenero.value,
            año: this.filtroAnio.value,
            estado: this.filtroEstado.value
        };
    }

    public renderEstrellas(calificacion: number): string {
        if (calificacion < 1 || calificacion > 5) {
            return "Sin calificación";
        }

        return "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
    }

    public renderEstadisticas(stats: Estadisticas, recomendaciones: Pelicula[], top5: Pelicula[], totalDirectores: number): void {
        const promedio = stats.promedio === 0 ? "—" : stats.promedio.toFixed(1);
        const recomendacionesHtml = this.renderListaPeliculas(
            recomendaciones,
            "No hay recomendaciones todavía. Califica con 4 o 5 estrellas."
        );
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

    private mostrarPestana(vista: string): void {
        this.pestanas.forEach((boton) => {
            const activa = boton.dataset.vista === vista;
            boton.classList.toggle("activa", activa);
            boton.setAttribute("aria-selected", activa ? "true" : "false");
        });

        this.paneles.forEach((panel) => {
            panel.hidden = panel.dataset.vista !== vista;
        });
    }

    private renderListaPeliculas(peliculas: Pelicula[], vacio: string, numerada: boolean = false): string {
        if (peliculas.length === 0) {
            return `<p>${vacio}</p>`;
        }

        const items = peliculas.map((pelicula) => {
            return `<li>${this.escapar(pelicula.titulo)} <span class="estrellas">${this.renderEstrellas(pelicula.calificacion)}</span></li>`;
        }).join("");

        const etiqueta = numerada ? "ol" : "ul";
        return `<${etiqueta}>${items}</${etiqueta}>`;
    }

    private escapar(texto: string): string {
        return texto
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }
}
