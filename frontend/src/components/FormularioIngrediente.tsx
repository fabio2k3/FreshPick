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
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <div>
        <label>
          Nombre:{" "}
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="ej. Zanahoria"
          />
        </label>
      </div>
      <div>
        <label>
          Cantidad:{" "}
          <input
            type="text"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="ej. 2 unidades"
          />
        </label>
      </div>
      <div>
        <label>
          Fecha de caducidad:{" "}
          <input
            type="date"
            value={fechaCaducidad}
            onChange={(e) => setFechaCaducidad(e.target.value)}
          />
        </label>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={enviando}>
        {enviando ? "Agregando..." : "Agregar ingrediente"}
      </button>
    </form>
  );
}