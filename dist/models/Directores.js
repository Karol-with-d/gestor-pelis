export class DirectorModel {
    directores = [];
    currentId = 1;
    addDirector(nombre, email) {
        const nuevo = {
            id: this.currentId++,
            nombre,
            email
        };
        this.directores.push(nuevo);
        return nuevo;
    }
    getAllDirectores() {
        return this.directores;
    }
    getDirectorById(id) {
        return this.directores.find((director) => director.id === id);
    }
    updateDirector(id, nombre, email) {
        const director = this.getDirectorById(id);
        if (director) {
            director.nombre = nombre;
            director.email = email;
        }
    }
    deleteDirector(id) {
        this.directores = this.directores.filter((director) => director.id !== id);
    }
    cargarDirectores(lista) {
        this.directores = lista.map((director) => {
            return {
                id: director.id,
                nombre: director.nombre,
                email: director.email ?? ""
            };
        });
        let maxId = 0;
        for (const director of this.directores) {
            if (director.id > maxId) {
                maxId = director.id;
            }
        }
        this.currentId = maxId + 1;
    }
}
