import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

// GET /lista-compra - listar todo
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lista_compra ORDER BY comprado ASC, creado_en DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la lista de compra" });
  }
});

// POST /lista-compra - agregar item
router.post("/", async (req: Request, res: Response) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    // Evita duplicados: si ya existe (sin comprar), no lo vuelve a insertar
    const existente = await pool.query(
      "SELECT * FROM lista_compra WHERE LOWER(nombre) = LOWER($1) AND comprado = FALSE",
      [nombre]
    );

    if (existente.rows.length > 0) {
      return res.status(409).json({ message: "Ese item ya está en la lista de compra", item: existente.rows[0] });
    }

    const result = await pool.query(
      "INSERT INTO lista_compra (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear item" });
  }
});

// PUT /lista-compra/:id - marcar como comprado (o editar nombre)
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, comprado } = req.body;

  try {
    const result = await pool.query(
      `UPDATE lista_compra
       SET nombre = COALESCE($1, nombre),
           comprado = COALESCE($2, comprado)
       WHERE id = $3 RETURNING *`,
      [nombre, comprado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar item" });
  }
});

// DELETE /lista-compra/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM lista_compra WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    res.json({ message: "Item eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar item" });
  }
});

export default router;