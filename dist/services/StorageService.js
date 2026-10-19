export class StorageService {
    clave = "peliculas";
    obtener() {
        const vacio = { peliculas: [], directores: [] };
        const texto = localStorage.getItem(this.clave);
        if (!texto) {
            return vacio;
        }
        try {
            const datos = JSON.parse(texto);
            if (Array.isArray(datos)) {
                return { peliculas: datos, directores: [] };
            }
            if (!datos || typeof datos !== "object") {
                return vacio;
            }
            const peliculas = Array.isArray(datos.peliculas) ? datos.peliculas : [];
            const directores = Array.isArray(datos.directores) ? datos.directores : [];
            return { peliculas, directores };
        }
        catch {
            return vacio;
        }
    }
    guardar(peliculas, directores) {
        const datos = { peliculas, directores };
        localStorage.setItem(this.clave, JSON.stringify(datos));
    }
}
