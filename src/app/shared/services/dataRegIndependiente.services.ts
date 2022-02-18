import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable } from "rxjs";

export interface Independiente {
    nombre: string,
    id: string,
    profesion: string,
    departamento: string,
    ciudad: string,
    direccion: string,
    telefono?: string,
    celular: string,
    correo: string,
    contraseña: string,
    descripcion: string,
    domicilio: string,
    servicios: string,
    nombreReferencia1: string,
    celularReferencia1: string,
    ocupacionReferencia1: string,
    nombreReferencia2: string,
    celularReferencia2: string,
    ocupacionReferencia2: string,
    codigoAsesor?: string,
}

@Injectable()
export class DataService1 {
    independiente!: Observable<Independiente>;
    private independienteCollection!: AngularFirestoreCollection<Independiente>;

    constructor(private readonly afs: AngularFirestore) {
        this.independienteCollection = afs.collection<any>('Independiente');
    }


    async onSaveIndependiente (independienteForm: Independiente): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const id = this.afs.createId();
                const data = {...independienteForm};
                const result = this.independienteCollection.doc(id).set(data);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        })
    }
}