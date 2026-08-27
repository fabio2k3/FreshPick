import { useState } from "react";
import { API_URL } from "../config";
import type { Ingrediente } from "../types";

interface Props {
  ingredientes: Ingrediente[];
  cargando: boolean;
  error: string | null;
  onCambio: () => void;
}

export default function ListaIngredientes({ ingredientes, cargando, error, onCambio }: Props) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [cantidadEdit, setCantidadEdit] = useState("");
  const [fechaEdit, setFechaEdit] = useState("");

  function iniciarEdicion(ing: Ingrediente) {
    setEditandoId(ing.id);
    setNombreEdit(ing.nombre);
    setCantidadEdit(ing.cantidad || "");
    setFechaEdit(ing.fecha_caducidad ? ing.fecha_caducidad.split("T")[0] : "");
  }

  function cancelarEdicion() {
    setEditandoId(null);
  }

  async function guardarEdicion(id: number) {
    try {
      const res = await fetch(`${API_URL}/ingredientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreEdit,
          cantidad: cantidadEdit || null,
          fecha_caducidad: fechaEdit || null,
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setEditandoId(null);
      onCambio();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function eliminar(id: number, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}" de tu nevera?`)) return;

    try {
      const res = await fetch(`${API_URL}/ingredientes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      onCambio();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  if (cargando) return <p>Cargando ingredientes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (ingredientes.length === 0) return <p>No hay ingredientes en tu nevera todavía.</p>;

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {ingredientes.map((ing) => (
        <li
          key={ing.id}
          style={{ marginBottom: "0.75rem", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
        >
          {editandoId === ing.id ? (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <input value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} placeholder="Nombre" />
              <input value={cantidadEdit} onChange={(e) => setCantidadEdit(e.target.value)} placeholder="Cantidad" />
              <input type="date" value={fechaEdit} onChange={(e) => setFechaEdit(e.target.value)} />
              <button onClick={() => guardarEdicion(ing.id)}>Guardar</button>
              <button onClick={cancelarEdicion}>Cancelar</button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <strong>{ing.nombre}</strong>
                {ing.cantidad && ` — ${ing.cantidad}`}
                {ing.fecha_caducidad && (
                  <span> (caduca: {new Date(ing.fecha_caducidad).toLocaleDateString()})</span>
                )}
              </span>
              <span>
                <button onClick={() => iniciarEdicion(ing)}>Editar</button>{" "}
                <button onClick={() => eliminar(ing.id, ing.nombre)}>Eliminar</button>
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}