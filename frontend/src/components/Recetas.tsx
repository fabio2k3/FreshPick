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

      if (!res.ok) {
        throw new Error(data.message || "Error al generar recetas");
      }

      setRecetas(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <button onClick={generarRecetas} disabled={cargando} style={{ padding: "0.6rem 1.2rem", fontSize: "1rem" }}>
        {cargando ? "Generando recetas..." : "🍳 Generar recetas con lo que tengo"}
      </button>

      {cargando && (
        <p style={{ marginTop: "1rem", color: "#666" }}>
          Esto puede tardar unos segundos, la IA está pensando...
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          Error: {error}
        </p>
      )}

      {!cargando && yaGenero && !error && recetas.length === 0 && (
        <p style={{ marginTop: "1rem" }}>No se generaron recetas. Intenta de nuevo.</p>
      )}

      {recetas.length > 0 && (
        <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {recetas.map((receta, i) => (
            <div key={i} style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "1rem" }}>
              <h3 style={{ marginTop: 0 }}>{receta.nombre}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                ⏱️ {receta.tiempo_estimado} · Usa: {receta.ingredientes_usados.join(", ")}
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