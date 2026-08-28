import { useState } from "react";
import { API_URL } from "../config";
import type { Receta } from "../types";

export default function Recetas() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yaGenero, setYaGenero] = useState(false);

  async function generarRecetas() {
    setCargando(true);
    setError(null);
    setYaGenero(true);

    try {
      const res = await fetch(`${API_URL}/recetas/generar`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al generar recetas");

      setRecetas(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <button className="btn btn--primary" onClick={generarRecetas} disabled={cargando}>
        {cargando ? "Pensando..." : "Generar recetas con lo que tengo"}
      </button>

      {cargando && (
        <p className="loading-text">
          Priorizando lo que se vence primero
          <span className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </p>
      )}

      {error && <p className="estado-msg estado-error">Error: {error}</p>}

      {!cargando && yaGenero && !error && recetas.length === 0 && (
        <p className="estado-msg">No se generaron recetas. Intenta de nuevo.</p>
      )}

      {recetas.length > 0 && (
        <div className="recetas-lista">
          {recetas.map((receta, i) => (
            <div key={i} className="receta-card">
              <h3>{receta.nombre}</h3>
              <p className="receta-card__meta">
                {receta.tiempo_estimado} · usa {receta.ingredientes_usados.join(", ")}
              </p>
              <ol>
                {receta.pasos.map((paso, j) => (
                  <li key={j}>{paso}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}