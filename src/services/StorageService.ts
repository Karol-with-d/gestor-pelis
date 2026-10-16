import type { Pelicula } from "../models/Peliculas.js";

export class StorageService {
    private clave = "peliculas";

    public obtener(): Pelicula[] {
        const texto = localStorage.getItem(this.clave);
        if (!texto) {
            return [];
        }

        try {
            const datos = JSON.parse(texto);
            if (!Array.isArray(datos)) {
                return [];
            }
            return datos as Pelicula[];
        } catch {
            return [];
        }
    }

    public guardar(peliculas: Pelicula[]): void {
        localStorage.setItem(this.clave, JSON.stringify(peliculas));
    }
}
