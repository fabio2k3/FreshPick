-- backend/src/db/migrations.sql

CREATE TABLE IF NOT EXISTS ingredientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidad VARCHAR(50),
    fecha_caducidad DATE,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lista_compra (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    comprado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- Índice para ordenar rápido por caducidad (lo usaremos mucho)
CREATE INDEX IF NOT EXISTS idx_ingredientes_caducidad ON ingredientes(fecha_caducidad);