import { useState } from "react";
import { API_URL } from "../config";
import type { Ingrediente } from "../types";
import { diasRestantes, estadoFrescura, textoSticker } from "../utils/fecha";

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

  if (cargando) return <p className="estado-msg">Cargando ingredientes...</p>;
  if (error) return <p className="estado-msg estado-error">Error: {error}</p>;
  if (ingredientes.length === 0)
    return <p className="estado-msg">Tu nevera está vacía. Agrega algo antes de que se dañe.</p>;

  return (
    <div className="ingredientes-grid">
      {ingredientes.map((ing) => {
        const dias = diasRestantes(ing.fecha_caducidad);
        const estado = estadoFrescura(dias);

        if (editandoId === ing.id) {
          return (
            <div key={ing.id} className="ingrediente-card ingrediente-card--editando">
              <div className="form-field">
                <label>Nombre</label>
                <input value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Cantidad</label>
                <input value={cantidadEdit} onChange={(e) => setCantidadEdit(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Caduca</label>
                <input type="date" value={fechaEdit} onChange={(e) => setFechaEdit(e.target.value)} />
              </div>
              <div className="ingrediente-card__acciones">
                <button className="btn btn--primary" onClick={() => guardarEdicion(ing.id)}>
                  Guardar
                </button>
                <button className="btn btn--ghost" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              </div>
            </div>
          );
        }

        return (
          <div key={ing.id} className="ingrediente-card">
            <span className="ingrediente-card__sticker" data-estado={estado}>
              {textoSticker(dias)}
            </span>
            <p className="ingrediente-card__nombre">{ing.nombre}</p>
            <p className="ingrediente-card__meta">
              {ing.cantidad || "—"}
              {ing.fecha_caducidad && (
                <> · {new Date(ing.fecha_caducidad).toLocaleDateString()}</>
              )}
            </p>
            <div className="ingrediente-card__acciones">
              <button className="btn" onClick={() => iniciarEdicion(ing)}>
                Editar
              </button>
              <button className="btn btn--ghost" onClick={() => eliminar(ing.id, ing.nombre)}>
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}