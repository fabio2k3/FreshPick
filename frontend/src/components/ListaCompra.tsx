import { useEffect, useState } from "react";
import { API_URL } from "../config";
import type { ItemCompra } from "../types";

export default function ListaCompra() {
  const [items, setItems] = useState<ItemCompra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoItem, setNuevoItem] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cargarItems() {
    setCargando(true);
    fetch(`${API_URL}/lista-compra`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar la lista de compra");
        return res.json();
      })
      .then((data: ItemCompra[]) => {
        setItems(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }

  useEffect(() => {
    cargarItems();
  }, []);

  async function agregarItem(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoItem.trim()) return;

    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/lista-compra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoItem }),
      });

      if (res.status === 409) {
        alert("Ese item ya está en tu lista de compra");
        return;
      }
      if (!res.ok) throw new Error("Error al agregar item");

      setNuevoItem("");
      cargarItems();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  async function toggleComprado(item: ItemCompra) {
    try {
      const res = await fetch(`${API_URL}/lista-compra/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comprado: !item.comprado }),
      });
      if (!res.ok) throw new Error("Error al actualizar item");
      cargarItems();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function eliminarItem(id: number) {
    try {
      const res = await fetch(`${API_URL}/lista-compra/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar item");
      cargarItems();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div className="compra-panel">
      <form onSubmit={agregarItem} className="compra-form">
        <input
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
          placeholder="ej. Pan"
        />
        <button type="submit" className="btn btn--primary" disabled={enviando}>
          {enviando ? "..." : "Agregar"}
        </button>
      </form>

      {cargando && <p className="estado-msg">Cargando lista de compra...</p>}
      {error && <p className="estado-msg estado-error">Error: {error}</p>}
      {!cargando && items.length === 0 && (
        <p className="estado-msg">Tu lista de compra está vacía.</p>
      )}

      {items.map((item) => (
        <div key={item.id} className={`compra-item ${item.comprado ? "comprado" : ""}`}>
          <label>
            <input
              type="checkbox"
              checked={item.comprado}
              onChange={() => toggleComprado(item)}
            />
            {item.nombre}
          </label>
          <button className="btn btn--ghost" onClick={() => eliminarItem(item.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}