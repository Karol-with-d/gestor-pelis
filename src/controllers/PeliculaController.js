export class PeliculaController {
    modelo;
    vista;
    storage;
    idEditando = null;
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
            this.eliminar(id);
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
        const anioNumero = Number(año);
        if (titulo === "" || genero === "" || Number.isNaN(anioNumero)) {
            this.vista.mostrarMensaje("Completa título, año y género.", true);
            return;
        }
        if (this.idEditando === null) {
            this.modelo.addPelicula(titulo, año, genero, false);
            this.vista.mostrarMensaje("Película agregada.", false);
        }
        else {
            this.modelo.updatePelicula(this.idEditando, titulo, año, genero);
            this.idEditando = null;
            this.vista.mostrarMensaje("Película actualizada.", false);
        }
        this.guardarYMostrar();
        this.vista.limpiarFormulario();
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
    eliminar(id) {
        this.modelo.deletePelicula(id);
        if (this.idEditando === id) {
            this.idEditando = null;
            this.vista.limpiarFormulario();
        }
        this.guardarYMostrar();
        this.vista.mostrarMensaje("Película eliminada.", false);
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
        let lista = this.modelo.getAllPeliculas();
        if (texto !== "") {
            lista = lista.filter((pelicula) => {
                return pelicula.titulo.toLowerCase().includes(texto)
                    || pelicula.genero.toLowerCase().includes(texto);
            });
        }
        if (filtros.genero !== "") {
            lista = lista.filter((pelicula) => pelicula.genero === filtros.genero);
        }
        if (filtros.estado === "vista") {
            lista = lista.filter((pelicula) => pelicula.vista);
        }
        if (filtros.estado === "pendiente") {
            lista = lista.filter((pelicula) => !pelicula.vista);
        }
        this.vista.renderizar(lista);
    }
    guardarYMostrar() {
        this.storage.guardar(this.modelo.getAllPeliculas());
        this.mostrar();
    }
}
