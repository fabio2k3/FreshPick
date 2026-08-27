export interface Ingrediente {
  id: number;
  nombre: string;
  cantidad: string | null;
  fecha_caducidad: string | null;
  creado_en: string;
}

export interface ItemCompra {
  id: number;
  nombre: string;
  comprado: boolean;
  creado_en: string;
}

export interface Receta {
  nombre: string;
  ingredientes_usados: string[];
  pasos: string[];
  tiempo_estimado: string;
}