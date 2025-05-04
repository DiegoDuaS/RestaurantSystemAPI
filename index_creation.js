import express from 'express';
import { getDB } from './mongoDB-connection.js';

const router = express.Router();
/**
 * POST /index/simple
 * Crea un índice simple en un campo específico de una colección.
 * 
 * Body esperado:
 * {
 *      collection: "nombre_coleccion",    // Nombre de la colección (obligatorio)
 *      field: "nombre_campo",             // Campo para indexar (obligatorio)
 *      options: {                         // Opciones de índice (opcional)
 *          unique: true|false,            // Si el índice debe ser único
 *          sparse: true|false,            // Si el índice debe ser disperso
 *          expireAfterSeconds: 3600       // TTL para documentos (solo para campos de fecha)
 *      }
 * }
 * 
 * Respuesta:
 * {
 *      name: "nombre_del_indice",         // Nombre del índice creado
 *      ok: 1                              // Indicador de éxito
 * }
 */
router.post('/index/simple', async (req, res) => {
    try {
        const db = getDB();
        const { collection, field, options = {} } = req.body;

        // Validación
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({ error: 'Nombre de colección inválido o ausente.' });
        }

        if (!field || typeof field !== 'string') {
            return res.status(400).json({ error: 'Campo para indexar inválido o ausente.' });
        }

        // Crear el índice
        const indexDefinition = {};
        indexDefinition[field] = 1; // 1 para orden ascendente, -1 para descendente

        const result = await db.collection(collection).createIndex(indexDefinition, options);

        return res.status(201).json({
            message: 'Índice simple creado exitosamente.',
            indexName: result
        });
    } catch (error) {
        console.error('Error al crear índice simple:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});



export default router;