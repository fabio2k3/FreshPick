import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import ingredientesRouter from "./routes/ingredientes";
import listaCompraRouter from "./routes/listaCompra";
import recetasRouter from "./routes/recetas";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", db_time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "No se pudo conectar a la BD" });
  }
});

app.use("/ingredientes", ingredientesRouter);
app.use("/lista-compra", listaCompraRouter);
app.use("/recetas", recetasRouter);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

