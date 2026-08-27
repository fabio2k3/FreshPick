import type { Ingrediente } from "../types";

interface Props {
  ingredientes: Ingrediente[];
  cargando: boolean;
  error: string | null;
}

export default function ListaIngredientes({ ingredientes, cargando, error }: Props) {
  if (cargando) return <p>Cargando ingredientes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (ingredientes.length === 0) return <p>No hay ingredientes en tu nevera todavía.</p>;

  return (
    <ul>
      {ingredientes.map((ing) => (
        <li key={ing.id}>
          <strong>{ing.nombre}</strong>
          {ing.cantidad && ` — ${ing.cantidad}`}
          {ing.fecha_caducidad && (
            <span> (caduca: {new Date(ing.fecha_caducidad).toLocaleDateString()})</span>
          )}
        </li>
      ))}
    </ul>
  );
}