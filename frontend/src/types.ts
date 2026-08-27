export interface Ingrediente {
  id: number;
  nombre: string;
  cantidad: string | null;
  fecha_caducidad: string | null;
  creado_en: string;
}