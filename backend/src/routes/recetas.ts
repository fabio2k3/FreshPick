import { Router, Request, Response } from "express";
import { pool } from "../db";
import { generarRecetas } from "../services/iaService";

const router = Router();

// POST /recetas/generar - genera 3 recetas con los ingredientes actuales de la nevera
router.post("/generar", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT nombre, cantidad, fecha_caducidad FROM ingredientes ORDER BY fecha_caducidad ASC NULLS LAST"
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "No hay ingredientes en la nevera" });
    }

    const recetas = await generarRecetas(result.rows);
    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al generar recetas", detail: (error as Error).message });
  }
});

export default router;