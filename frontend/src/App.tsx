import { useEffect, useState } from "react";
import { API_URL } from "./config";
import type { Ingrediente } from "./types";
import FormularioIngrediente from "./components/FormularioIngrediente";
import ListaIngredientes from "./components/ListaIngredientes";
import ListaCompra from "./components/ListaCompra";
import Recetas from "./components/Recetas";

function App() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargarIngredientes() {
    setCargando(true);
    fetch(`${API_URL}/ingredientes`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar ingredientes");
        return res.json();
      })
      .then((data: Ingrediente[]) => {
        setIngredientes(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }

  useEffect(() => {
    cargarIngredientes();
  }, []);

  return (
    <div>
      <header className="hero">
        <p className="hero__eyebrow">Cero desperdicio · Cocina con lo que hay</p>
        <h1 className="hero__title">
          Antes que se dañe,
          <br />
          <em>cocínalo.</em>
        </h1>
        <p className="hero__sub">
          Registra lo que tienes en la nevera, prioriza lo que se vence primero
          y deja que la IA te diga qué preparar hoy.
        </p>
      </header>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Tu nevera</h2>
          <span className="section__count">{ingredientes.length} items</span>
        </div>
        <FormularioIngrediente onIngredienteCreado={cargarIngredientes} />
        <div style={{ height: "1rem" }} />
        <ListaIngredientes
          ingredientes={ingredientes}
          cargando={cargando}
          error={error}
          onCambio={cargarIngredientes}
        />
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">¿Qué puedo cocinar?</h2>
        </div>
        <Recetas />
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Lista de compra</h2>
        </div>
        <ListaCompra />
      </section>
    </div>
  );
}

export default App;