export class StorageService {
    clave = "peliculas";
    obtener() {
        const texto = localStorage.getItem(this.clave);
        if (!texto) {
            return [];
        }
        try {
            const datos = JSON.parse(texto);
            if (!Array.isArray(datos)) {
                return [];
            }
            return datos;
        }
        catch {
            return [];
        }
    }
    guardar(peliculas) {
        localStorage.setItem(this.clave, JSON.stringify(peliculas));
    }
}
