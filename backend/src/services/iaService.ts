interface Ingrediente {
  nombre: string;
  cantidad: string | null;
  fecha_caducidad: Date | string | null;
}

interface Receta {
  nombre: string;
  ingredientes_usados: string[];
  pasos: string[];
  tiempo_estimado: string;
}

interface HuggingFaceResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

function formatearFecha(fecha: Date | string): string {
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  return date.toISOString().split("T")[0];
}

export async function generarRecetas(ingredientes: Ingrediente[]): Promise<Receta[]> {
  const listaTexto = ingredientes
    .map((ing) => {
      const caducidad = ing.fecha_caducidad
        ? ` (caduca: ${formatearFecha(ing.fecha_caducidad)})`
        : "";
      return `- ${ing.nombre}${ing.cantidad ? `: ${ing.cantidad}` : ""}${caducidad}`;
    })
    .join("\n");

  const prompt = `Eres un chef experto. Tengo estos ingredientes en mi nevera:
${listaTexto}

Genera EXACTAMENTE 3 recetas usando SOLO estos ingredientes (puedes asumir que tengo sal, aceite, agua y especias básicas de despensa). Prioriza usar los ingredientes que caducan antes.

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, con este formato exacto:
[
  {
    "nombre": "Nombre de la receta",
    "ingredientes_usados": ["ingrediente1", "ingrediente2"],
    "pasos": ["Paso 1...", "Paso 2..."],
    "tiempo_estimado": "20 minutos"
  }
]`;

  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error de Hugging Face (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as HuggingFaceResponse;
  const contenido = data.choices?.[0]?.message?.content;

  if (!contenido) {
    throw new Error("La IA no devolvió contenido");
  }

  const jsonLimpio = contenido.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(jsonLimpio) as Receta[];
  } catch (e) {
    throw new Error(`No se pudo parsear la respuesta de la IA: ${jsonLimpio}`);
  }
}