import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// GET /ingredientes - listar todos, ordenados por caducidad más próxima primero
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ingredientes ORDER BY fecha_caducidad ASC NULLS LAST, creado_en DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener ingredientes" });
  }
});

// POST /ingredientes - crear uno nuevo
router.post("/", async (req: Request, res: Response) => {
  const { nombre, cantidad, fecha_caducidad } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ingredientes (nombre, cantidad, fecha_caducidad)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, cantidad || null, fecha_caducidad || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear ingrediente" });
  }
});

// PUT /ingredientes/:id - editar uno existente
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, cantidad, fecha_caducidad } = req.body;

  try {
    const result = await pool.query(
      `UPDATE ingredientes
       SET nombre = $1, cantidad = $2, fecha_caducidad = $3
       WHERE id = $4 RETURNING *`,
      [nombre, cantidad || null, fecha_caducidad || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar ingrediente" });
  }
});

// DELETE /ingredientes/:id - eliminar uno
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM ingredientes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ingrediente no encontrado" });
    }

    res.json({ message: "Ingrediente eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar ingrediente" });
  }
});

export default router;