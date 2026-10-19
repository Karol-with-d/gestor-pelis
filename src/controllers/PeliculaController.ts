import { DirectorModel } from "../models/Directores.js";
import { PeliculaModel, type DatosPelicula } from "../models/Peliculas.js";
import { StorageService } from "../services/StorageService.js";
import { PeliculaView } from "../views/PeliculaView.js";

export class PeliculaController {
    private idEditando: number | null = null;
    private idDirectorEditando: number | null = null;
    private criterioOrden = "";

    constructor(
        private modelo: PeliculaModel,
        private directores: DirectorModel,
        private vista: PeliculaView,
        private storage: StorageService
    ) {
        this.init();
    }

    private init(): void {
        const guardadas = this.storage.obtener();
        this.modelo.cargarPeliculas(guardadas.peliculas);
        this.directores.cargarDirectores(guardadas.directores);

        this.vista.bindGuardar(this.guardar.bind(this));
        this.vista.bindCancelar(this.cancelarEdicion.bind(this));
        this.vista.bindAccionesPelicula({
            eliminar: this.handleDelete.bind(this),
            editar: this.empezarEdicion.bind(this),
            toggle: this.cambiarVista.bind(this)
        });
        this.vista.bindFiltrar(this.mostrar.bind(this));
        this.vista.bindOrdenar(this.handleSort.bind(this));
        this.vista.bindGuardarDirector(this.guardarDirector.bind(this));
        this.vista.bindCancelarDirector(this.cancelarEdicionDirector.bind(this));
        this.vista.bindAccionesDirector({
            eliminar: this.eliminarDirector.bind(this),
            editar: this.empezarEdicionDirector.bind(this)
        });

        this.mostrar();
    }

    private cancelarEdicion(): void {
        this.idEditando = null;
        this.vista.limpiarFormulario();
        this.vista.mostrarMensaje("Edición cancelada.", false);
    }

    private cancelarEdicionDirector(): void {
        this.idDirectorEditando = null;
        this.vista.limpiarFormularioDirector();
        this.vista.mostrarMensaje("Edición cancelada.", false);
    }

    private guardar(datos: DatosPelicula): void {
        const titulo = datos.titulo.trim();
        const año = datos.año.trim();
        const genero = datos.genero;
        const comentario = datos.comentario.trim();
        const calificacion = datos.calificacion;
        const directorId = datos.directorId;
        const anioNumero = Number(año);
        const error = this.validar(titulo, anioNumero, genero, directorId, calificacion);

        if (error !== "") {
            this.vista.mostrarMensaje(error, true);
            return;
        }

        const limpios: DatosPelicula = { titulo, año, genero, directorId, calificacion, comentario };

        if (this.idEditando === null) {
            this.modelo.addPelicula(titulo, año, genero, directorId, false, calificacion, comentario);
            this.vista.mostrarMensaje("Película agregada.", false);
            this.guardarYMostrar();
            this.vista.limpiarFormulario();
            return;
        }

        this.handleUpdate(this.idEditando, limpios);
    }

    private validar(titulo: string, anioNumero: number, genero: string, directorId: number, calificacion: number): string {
        if (titulo === "") {
            return "Escribe un título.";
        }

        if (!Number.isInteger(anioNumero) || anioNumero < 1888 || anioNumero > 2100) {
            return "El año debe estar entre 1888 y 2100.";
        }

        if (genero === "") {
            return "Elige un género.";
        }

        if (!this.directores.getDirectorById(directorId)) {
            return "Elige un director. Si no hay, créalo en la pestaña Directores.";
        }

        if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
            return "La calificación debe ser de 1 a 5.";
        }

        const repetida = this.modelo.getAllPeliculas().some((pelicula) => {
            return pelicula.titulo.toLowerCase() === titulo.toLowerCase() && pelicula.id !== this.idEditando;
        });

        if (repetida) {
            return "Ya existe una película con ese título.";
        }

        return "";
    }

    public handleUpdate(id: number, datos: DatosPelicula): void {
        this.modelo.updatePelicula(id, datos.titulo, datos.año, datos.genero, datos.directorId, datos.calificacion, datos.comentario);
        this.idEditando = null;
        this.vista.mostrarMensaje("Película actualizada.", false);
        this.guardarYMostrar();
        this.vista.limpiarFormulario();
    }

    public handleDelete(id: number): void {
        const pelicula = this.modelo.getPeliculaById(id);
        if (!pelicula) {
            return;
        }

        const confirmar = window.confirm(`¿Eliminar "${pelicula.titulo}"?`);
        if (!confirmar) {
            return;
        }

        this.modelo.deletePelicula(id);

        if (this.idEditando === id) {
            this.idEditando = null;
            this.vista.limpiarFormulario();
        }

        this.guardarYMostrar();
        this.vista.mostrarMensaje("Película eliminada.", false);
    }

    public handleSort(criterio: string): void {
        this.criterioOrden = criterio;
        this.mostrar();
    }

    private guardarDirector(nombre: string, email: string): void {
        const limpio = nombre.trim();
        const correo = email.trim();
        const error = this.validarDirector(limpio, correo);

        if (error !== "") {
            this.vista.mostrarMensaje(error, true);
            return;
        }

        if (this.idDirectorEditando === null) {
            this.directores.addDirector(limpio, correo);
            this.vista.mostrarMensaje("Director agregado.", false);
        } else {
            this.directores.updateDirector(this.idDirectorEditando, limpio, correo);
            this.idDirectorEditando = null;
            this.vista.mostrarMensaje("Director actualizado.", false);
        }

        this.guardarYMostrar();
        this.vista.limpiarFormularioDirector();
    }

    private validarDirector(nombre: string, email: string): string {
        if (nombre === "") {
            return "Escribe el nombre del director.";
        }

        if (!/^[\p{L}][\p{L}\s.'-]{1,59}$/u.test(nombre)) {
            return "El nombre debe tener entre 2 y 60 caracteres, solo letras, espacios, puntos o guiones.";
        }

        if (email === "") {
            return "Escribe un correo.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "El correo no tiene un formato válido.";
        }

        const repetido = this.directores.getAllDirectores().some((director) => {
            return director.nombre.toLowerCase() === nombre.toLowerCase() && director.id !== this.idDirectorEditando;
        });

        if (repetido) {
            return "Ya existe un director con ese nombre.";
        }

        return "";
    }

    private eliminarDirector(id: number): void {
        const director = this.directores.getDirectorById(id);
        if (!director) {
            return;
        }

        const asociadas = this.modelo.getAllPeliculas().filter((pelicula) => pelicula.directorId === id);
        if (asociadas.length > 0) {
            this.vista.mostrarMensaje("No puedes eliminar un director que tiene películas.", true);
            return;
        }

        const confirmar = window.confirm(`¿Eliminar a "${director.nombre}"?`);
        if (!confirmar) {
            return;
        }

        this.directores.deleteDirector(id);

        if (this.idDirectorEditando === id) {
            this.idDirectorEditando = null;
            this.vista.limpiarFormularioDirector();
        }

        this.guardarYMostrar();
        this.vista.mostrarMensaje("Director eliminado.", false);
    }

    private empezarEdicionDirector(id: number): void {
        const director = this.directores.getDirectorById(id);
        if (!director) {
            return;
        }

        this.idDirectorEditando = id;
        this.vista.llenarFormularioDirector(director);
        this.vista.mostrarMensaje("Editando director.", false);
    }

    private empezarEdicion(id: number): void {
        const pelicula = this.modelo.getPeliculaById(id);
        if (!pelicula) {
            return;
        }

        this.idEditando = id;
        this.vista.llenarFormulario(pelicula);
        this.vista.mostrarMensaje("Editando película.", false);
    }

    private cambiarVista(id: number): void {
        const pelicula = this.modelo.getPeliculaById(id);
        if (!pelicula) {
            return;
        }

        this.modelo.toggleVista(id);
        this.guardarYMostrar();

        const texto = pelicula.vista ? "Marcada como vista." : "Marcada como pendiente.";
        this.vista.mostrarMensaje(texto, false);
    }

    private mostrar(): void {
        const filtros = this.vista.obtenerFiltros();
        const texto = filtros.busqueda.trim().toLowerCase();
        let lista = this.modelo.filterByGenero(filtros.genero);

        if (texto !== "") {
            lista = lista.filter((pelicula) => {
                const director = this.nombreDirector(pelicula.directorId).toLowerCase();
                return pelicula.titulo.toLowerCase().includes(texto)
                    || pelicula.genero.toLowerCase().includes(texto)
                    || director.includes(texto);
            });
        }

        if (filtros.año !== "") {
            lista = lista.filter((pelicula) => pelicula.año === filtros.año);
        }

        if (filtros.estado === "vista") {
            lista = lista.filter((pelicula) => pelicula.vista);
        }

        if (filtros.estado === "pendiente") {
            lista = lista.filter((pelicula) => !pelicula.vista);
        }

        lista = this.modelo.ordenar(lista, this.criterioOrden);
        this.vista.renderizar(lista.map((pelicula) => {
            return {
                ...pelicula,
                directorNombre: this.nombreDirector(pelicula.directorId)
            };
        }));
        this.vista.llenarSelectDirectores(this.directores.getAllDirectores());
        this.vista.renderDirectores(this.directores.getAllDirectores().map((director) => {
            return {
                ...director,
                titulos: this.modelo.getAllPeliculas()
                    .filter((pelicula) => pelicula.directorId === director.id)
                    .map((pelicula) => pelicula.titulo)
            };
        }));
        this.vista.renderEstadisticas(
            this.modelo.getEstadisticas(),
            this.modelo.getRecomendaciones(),
            this.modelo.getTop5(),
            this.directores.getAllDirectores().length
        );
    }

    private nombreDirector(id: number): string {
        return this.directores.getDirectorById(id)?.nombre ?? "Sin director";
    }

    private guardarYMostrar(): void {
        this.storage.guardar(this.modelo.getAllPeliculas(), this.directores.getAllDirectores());
        this.mostrar();
    }
}
