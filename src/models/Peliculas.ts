export interface Pelicula {
    id: number
    titulo: string
    año: string
    genero: string
    vista: boolean
    calificacion: number
    comentario: string
}

export interface DatosPelicula {
    titulo: string
    año: string
    genero: string
    calificacion: number
    comentario: string
}

export interface Estadisticas {
    total: number
    vistas: number
    pendientes: number
    promedio: number
}

export class PeliculaModel {
    private peliculas: Pelicula[] = [];
    private currentId: number = 1;

    public addPelicula(titulo: string, año: string, genero: string, vista: boolean, calificacion: number, comentario: string): Pelicula {
        const newPelicula: Pelicula = {
            id: this.currentId++,
            titulo,
            año,
            genero,
            vista,
            calificacion,
            comentario
        };
        this.peliculas.push(newPelicula);
        return newPelicula;
    }
    public getAllPeliculas(): Pelicula[]{
        return this.peliculas;
    }

    public getPeliculaById(id: number): Pelicula | undefined {
        return this.peliculas.find((pelicula)=> pelicula.id===id);
    }

    public updatePelicula(id: number, titulo: string, año: string, genero: string, calificacion: number, comentario: string): void {
        const pelicula = this.getPeliculaById(id);
        if (pelicula) {
            pelicula.titulo = titulo;
            pelicula.año = año;
            pelicula.genero = genero;
            pelicula.calificacion = calificacion;
            pelicula.comentario = comentario;
        }
    }

    public deletePelicula(id: number): void {
        this.peliculas = this.peliculas.filter((pelicula) => pelicula.id !== id);
    }

    public toggleVista(id: number): void {
        const pelicula = this.getPeliculaById(id);
        if (pelicula) {
            pelicula.vista = !pelicula.vista;
        }
    }

    public filterByGenero(genero: string): Pelicula[] {
        if (genero === "") {
            return [...this.peliculas];
        }
        return this.peliculas.filter((pelicula) => pelicula.genero === genero);
    }

    public sortByCalificacion(): Pelicula[] {
        return [...this.peliculas].sort((a, b) => b.calificacion - a.calificacion);
    }

    public ordenar(lista: Pelicula[], criterio: string): Pelicula[] {
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

    public getEstadisticas(): Estadisticas {
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

    public getRecomendaciones(): Pelicula[] {
        return this.peliculas.filter((pelicula) => pelicula.calificacion >= 4);
    }

    public getTop5(): Pelicula[] {
        return this.sortByCalificacion()
            .filter((pelicula) => pelicula.calificacion >= 1)
            .slice(0, 5);
    }

    public cargarPeliculas(lista: Pelicula[]): void {
        this.peliculas = lista.map((pelicula) => {
            return {
                id: pelicula.id,
                titulo: pelicula.titulo,
                año: pelicula.año,
                genero: pelicula.genero,
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