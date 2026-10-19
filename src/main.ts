import { PeliculaController } from "./controllers/PeliculaController.js";
import { DirectorModel } from "./models/Directores.js";
import { PeliculaModel } from "./models/Peliculas.js";
import { StorageService } from "./services/StorageService.js";
import { PeliculaView } from "./views/PeliculaView.js";

document.addEventListener("DOMContentLoaded", () => {
    const modelo = new PeliculaModel();
    const directores = new DirectorModel();
    const storage = new StorageService();
    const vista = new PeliculaView();
    const controller = new PeliculaController(modelo, directores, vista, storage);

    console.log("Aplicación MVC iniciada correctamente");
});
