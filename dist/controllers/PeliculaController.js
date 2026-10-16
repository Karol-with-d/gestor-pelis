export class PeliculaController {
    modelo;
    vista;
    storage;
    idEditando = null;
    criterioOrden = "";
    constructor(modelo, vista, storage) {
        this.modelo = modelo;
        this.vista = vista;
        this.storage = storage;
    }
    iniciar() {
        const guardadas = this.storage.obtener();
        this.modelo.cargarPeliculas(guardadas);
        this.conectarEventos();
        this.mostrar();
    }
    conectarEventos() {
        this.vista.onGuardar = (datos) => {
            this.guardar(datos);
        };
        this.vista.onEliminar = (id) => {
            this.handleDelete(id);
        };
        this.vista.onEditar = (id) => {
            this.empezarEdicion(id);
        };
        this.vista.onToggle = (id) => {
            this.cambiarVista(id);
        };
        this.vista.onFiltrar = () => {
            this.mostrar();
        };
        this.vista.onOrdenar = (criterio) => {
            this.handleSort(criterio);
        };
        this.vista.onCancelar = () => {
            this.idEditando = null;
            this.vista.limpiarFormulario();
            this.vista.mostrarMensaje("Edición cancelada.", false);
        };
    }
    guardar(datos) {
        const titulo = datos.titulo.trim();
        const año = datos.año.trim();
        const genero = datos.genero;
        const comentario = datos.comentario.trim();
        const calificacion = datos.calificacion;
        const anioNumero = Number(año);
        const error = this.validar(titulo, anioNumero, genero, calificacion);
        if (error !== "") {
            this.vista.mostrarMensaje(error, true);
            return;
        }
        const limpios = { titulo, año, genero, calificacion, comentario };
        if (this.idEditando === null) {
            this.modelo.addPelicula(titulo, año, genero, false, calificacion, comentario);
            this.vista.mostrarMensaje("Película agregada.", false);
            this.guardarYMostrar();
            this.vista.limpiarFormulario();
            return;
        }
        this.handleUpdate(this.idEditando, limpios);
    }
    validar(titulo, anioNumero, genero, calificacion) {
        if (titulo === "") {
            return "Escribe un título.";
        }
        if (!Number.isInteger(anioNumero) || anioNumero < 1888 || anioNumero > 2100) {
            return "El año debe estar entre 1888 y 2100.";
        }
        if (genero === "") {
            return "Elige un género.";
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
    handleUpdate(id, datos) {
        this.modelo.updatePelicula(id, datos.titulo, datos.año, datos.genero, datos.calificacion, datos.comentario);
        this.idEditando = null;
        this.vista.mostrarMensaje("Película actualizada.", false);
        this.guardarYMostrar();
        this.vista.limpiarFormulario();
    }
    handleDelete(id) {
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
    handleSort(criterio) {
        this.criterioOrden = criterio;
        this.mostrar();
    }
    empezarEdicion(id) {
        const pelicula = this.modelo.getPeliculaById(id);
        if (!pelicula) {
            return;
        }
        this.idEditando = id;
        this.vista.llenarFormulario(pelicula);
        this.vista.mostrarMensaje("Editando película.", false);
    }
    cambiarVista(id) {
        const pelicula = this.modelo.getPeliculaById(id);
        if (!pelicula) {
            return;
        }
        this.modelo.toggleVista(id);
        this.guardarYMostrar();
        const texto = pelicula.vista ? "Marcada como vista." : "Marcada como pendiente.";
        this.vista.mostrarMensaje(texto, false);
    }
    mostrar() {
        const filtros = this.vista.obtenerFiltros();
        const texto = filtros.busqueda.trim().toLowerCase();
        let lista = this.modelo.filterByGenero(filtros.genero);
        if (texto !== "") {
            lista = lista.filter((pelicula) => {
                return pelicula.titulo.toLowerCase().includes(texto)
                    || pelicula.genero.toLowerCase().includes(texto);
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
        this.vista.renderizar(lista);
        this.vista.renderEstadisticas(this.modelo.getEstadisticas(), this.modelo.getRecomendaciones(), this.modelo.getTop5());
    }
    guardarYMostrar() {
        this.storage.guardar(this.modelo.getAllPeliculas());
        this.mostrar();
    }
}
