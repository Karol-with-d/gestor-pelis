import type { DatosPelicula, Estadisticas, Pelicula } from "../models/Peliculas.js";

export class PeliculaView {
    private form: HTMLFormElement;
    private titulo: HTMLInputElement;
    private anio: HTMLInputElement;
    private genero: HTMLSelectElement;
    private calificacion: HTMLSelectElement;
    private comentario: HTMLInputElement;
    private botonGuardar: HTMLButtonElement;
    private botonCancelar: HTMLButtonElement;
    private buscar: HTMLInputElement;
    private filtroGenero: HTMLSelectElement;
    private filtroAnio: HTMLInputElement;
    private filtroEstado: HTMLSelectElement;
    private ordenar: HTMLSelectElement;
    private estadisticas: HTMLElement;
    private lista: HTMLElement;
    private mensaje: HTMLElement;

    public onGuardar: (datos: DatosPelicula) => void = () => {};
    public onEliminar: (id: number) => void = () => {};
    public onEditar: (id: number) => void = () => {};
    public onToggle: (id: number) => void = () => {};
    public onFiltrar: () => void = () => {};
    public onOrdenar: (criterio: string) => void = () => {};
    public onCancelar: () => void = () => {};

    constructor() {
        this.form = document.getElementById("form-pelicula") as HTMLFormElement;
        this.titulo = document.getElementById("titulo") as HTMLInputElement;
        this.anio = document.getElementById("anio") as HTMLInputElement;
        this.genero = document.getElementById("genero") as HTMLSelectElement;
        this.calificacion = document.getElementById("calificacion") as HTMLSelectElement;
        this.comentario = document.getElementById("comentario") as HTMLInputElement;
        this.botonGuardar = document.getElementById("btn-guardar") as HTMLButtonElement;
        this.botonCancelar = document.getElementById("btn-cancelar") as HTMLButtonElement;
        this.buscar = document.getElementById("buscar") as HTMLInputElement;
        this.filtroGenero = document.getElementById("filtro-genero") as HTMLSelectElement;
        this.filtroAnio = document.getElementById("filtro-anio") as HTMLInputElement;
        this.filtroEstado = document.getElementById("filtro-estado") as HTMLSelectElement;
        this.ordenar = document.getElementById("ordenar") as HTMLSelectElement;
        this.estadisticas = document.getElementById("estadisticas") as HTMLElement;
        this.lista = document.getElementById("lista") as HTMLElement;
        this.mensaje = document.getElementById("mensaje") as HTMLElement;

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.onGuardar(this.obtenerDatosFormulario());
        });

        this.botonCancelar.addEventListener("click", () => {
            this.onCancelar();
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

        this.lista.addEventListener("click", (event) => {
            const objetivo = event.target as HTMLElement;
            const boton = objetivo.closest("button");
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
    }

    public renderizar(peliculas: Pelicula[]): void {
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

    public mostrarMensaje(texto: string, esError: boolean): void {
        this.mensaje.textContent = texto;
        this.mensaje.className = esError ? "mensaje-error" : "mensaje-ok";
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
        this.calificacion.value = pelicula.calificacion > 0 ? String(pelicula.calificacion) : "";
        this.comentario.value = pelicula.comentario;
        this.botonGuardar.textContent = "Guardar cambios";
        this.botonCancelar.hidden = false;
    }

    public obtenerDatosFormulario(): DatosPelicula {
        return {
            titulo: this.titulo.value,
            año: this.anio.value,
            genero: this.genero.value,
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

    public renderEstadisticas(stats: Estadisticas, recomendaciones: Pelicula[], top5: Pelicula[]): void {
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
            .replaceAll(">", "&gt;");
    }
}
