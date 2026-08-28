import { useState } from "react";
import { API_URL } from "../config";

interface Props {
  onIngredienteCreado: () => void;
}

export default function FormularioIngrediente({ onIngredienteCreado }: Props) {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch(`${API_URL}/ingredientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          cantidad: cantidad || null,
          fecha_caducidad: fechaCaducidad || null,
        }),
      });

      if (!res.ok) throw new Error("Error al crear el ingrediente");

      setNombre("");
      setCantidad("");
      setFechaCaducidad("");
      onIngredienteCreado();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-panel">
      <div className="form-field">
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="ej. Zanahoria"
        />
      </div>
      <div className="form-field">
        <label>Cantidad</label>
        <input
          type="text"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="2 unidades"
        />
      </div>
      <div className="form-field">
        <label>Caduca</label>
        <input
          type="date"
          value={fechaCaducidad}
          onChange={(e) => setFechaCaducidad(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn--primary" disabled={enviando}>
        {enviando ? "Guardando..." : "Agregar"}
      </button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}