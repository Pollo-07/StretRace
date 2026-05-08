import { typeCategory } from "../../../types/categoryTypes";

export class Category {

  public id: string;
  public nombre: string;
  public descripcion: string | null;
  public activo: boolean;

  constructor(data:typeCategory) {

    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.activo = data.activo;

  }

}