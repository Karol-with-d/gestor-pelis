export class PeliculaModel {
    peliculas = [];
    currentId = 1;
    addPelicula(titulo, año, genero, directorId, vista, calificacion, comentario) {
        const newPelicula = {
            id: this.currentId++,
            titulo,
            año,
            genero,
            directorId,
            vista,
            calificacion,
            comentario
        };
        this.peliculas.push(newPelicula);
        return newPelicula;
    }
    getAllPeliculas() {
        return this.peliculas;
    }
    getPeliculaById(id) {
        return this.peliculas.find((pelicula) => pelicula.id === id);
    }
    updatePelicula(id, titulo, año, genero, directorId, calificacion, comentario) {
        const pelicula = this.getPeliculaById(id);
        if (pelicula) {
            pelicula.titulo = titulo;
            pelicula.año = año;
            pelicula.genero = genero;
            pelicula.directorId = directorId;
            pelicula.calificacion = calificacion;
            pelicula.comentario = comentario;
        }
    }
    deletePelicula(id) {
        this.peliculas = this.peliculas.filter((pelicula) => pelicula.id !== id);
    }
    toggleVista(id) {
        const pelicula = this.getPeliculaById(id);
        if (pelicula) {
            pelicula.vista = !pelicula.vista;
        }
    }
    filterByGenero(genero) {
        if (genero === "") {
            return [...this.peliculas];
        }
        return this.peliculas.filter((pelicula) => pelicula.genero === genero);
    }
    sortByCalificacion() {
        return [...this.peliculas].sort((a, b) => b.calificacion - a.calificacion);
    }
    ordenar(lista, criterio) {
        const copia = [...lista];
        if (criterio === "titulo") {
            copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
        }
        if (criterio === "año") {
            copia.sort((a, b) => Number(a.año) - Number(b.año));
        }
        if (criterio === "calificacion") {
            copia.sort((a, b) => b.calificacion - a.calificacion);
        }
        return copia;
    }
    getEstadisticas() {
        const total = this.peliculas.length;
        const vistas = this.peliculas.filter((pelicula) => pelicula.vista).length;
        const conNota = this.peliculas.filter((pelicula) => pelicula.calificacion >= 1);
        const suma = conNota.reduce((totalNotas, pelicula) => totalNotas + pelicula.calificacion, 0);
        const promedio = conNota.length === 0 ? 0 : suma / conNota.length;
        return {
            total,
            vistas,
            pendientes: total - vistas,
            promedio
        };
    }
    getRecomendaciones() {
        return this.peliculas.filter((pelicula) => pelicula.calificacion >= 4);
    }
    getTop5() {
        return this.sortByCalificacion()
            .filter((pelicula) => pelicula.calificacion >= 1)
            .slice(0, 5);
    }
    cargarPeliculas(lista) {
        this.peliculas = lista.map((pelicula) => {
            return {
                id: pelicula.id,
                titulo: pelicula.titulo,
                año: pelicula.año,
                genero: pelicula.genero,
                directorId: typeof pelicula.directorId === "number" ? pelicula.directorId : 0,
                vista: pelicula.vista,
                calificacion: pelicula.calificacion ?? 0,
                comentario: pelicula.comentario ?? ""
            };
        });
        let maxId = 0;
        for (const pelicula of this.peliculas) {
            if (pelicula.id > maxId) {
                maxId = pelicula.id;
            }
        }
        this.currentId = maxId + 1;
    }
}
