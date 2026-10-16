import { PeliculaController } from "./controllers/PeliculaController.js";
import { PeliculaModel } from "./models/Peliculas.js";
import { StorageService } from "./services/StorageService.js";
import { PeliculaView } from "./views/PeliculaView.js";
const modelo = new PeliculaModel();
const storage = new StorageService();
const vista = new PeliculaView();
const controller = new PeliculaController(modelo, vista, storage);
controller.iniciar();
