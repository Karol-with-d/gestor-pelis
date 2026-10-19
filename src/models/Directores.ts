export interface Director {
    id: number
    nombre: string
    email: string
}

export class DirectorModel {
    private directores: Director[] = [];
    private currentId: number = 1;

    public addDirector(nombre: string, email: string): Director {
        const nuevo: Director = {
            id: this.currentId++,
            nombre,
            email
        };
        this.directores.push(nuevo);
        return nuevo;
    }

    public getAllDirectores(): Director[] {
        return this.directores;
    }

    public getDirectorById(id: number): Director | undefined {
        return this.directores.find((director) => director.id === id);
    }

    public updateDirector(id: number, nombre: string, email: string): void {
        const director = this.getDirectorById(id);
        if (director) {
            director.nombre = nombre;
            director.email = email;
        }
    }

    public deleteDirector(id: number): void {
        this.directores = this.directores.filter((director) => director.id !== id);
    }

    public cargarDirectores(lista: Director[]): void {
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
