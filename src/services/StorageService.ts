import type { Director } from "../models/Directores.js";
import type { Pelicula } from "../models/Peliculas.js";

export interface ColeccionGuardada {
    peliculas: Pelicula[]
    directores: Director[]
}

export class StorageService {
    private clave = "peliculas";

    public obtener(): ColeccionGuardada {
        const vacio: ColeccionGuardada = { peliculas: [], directores: [] };
        const texto = localStorage.getItem(this.clave);
        if (!texto) {
            return vacio;
        }

        try {
            const datos = JSON.parse(texto);
            if (Array.isArray(datos)) {
                return { peliculas: datos as Pelicula[], directores: [] };
            }

            if (!datos || typeof datos !== "object") {
                return vacio;
            }

            const peliculas = Array.isArray(datos.peliculas) ? datos.peliculas as Pelicula[] : [];
            const directores = Array.isArray(datos.directores) ? datos.directores as Director[] : [];
            return { peliculas, directores };
        } catch {
            return vacio;
        }
    }

    public guardar(peliculas: Pelicula[], directores: Director[]): void {
        const datos: ColeccionGuardada = { peliculas, directores };
        localStorage.setItem(this.clave, JSON.stringify(datos));
    }
}
