import { useEffect, useState } from "react";
import { API_URL } from "./config";
import type { Ingrediente } from "./types";
import FormularioIngrediente from "./components/FormularioIngrediente";
import ListaIngredientes from "./components/ListaIngredientes";

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
      <h1>🥬 NeveraIA</h1>

      <h2>Agregar ingrediente</h2>
      <FormularioIngrediente onIngredienteCreado={cargarIngredientes} />

      <h2>Tu nevera</h2>
      <ListaIngredientes
        ingredientes={ingredientes}
        cargando={cargando}
        error={error}
      />
    </div>
  );
}

export default App;