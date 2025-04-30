import express from 'express';
import { getDB } from './mongoDB-connection.js';

const router = express.Router();

/**
 * POST /skip
 * Consulta documentos desde una colección aplicando un valor de 'skip' para paginación.
 * 
 * Body esperado:
 * {
 *      collection - Nombre de la colección a consultar (obligatorio).
 *      filter - Filtro MongoDB para buscar documentos.
 *      skip - Número de documentos que se omitirán desde el inicio del cursor.
 * }
 * 
 * Respuesta:
 * Lista de documentos que coinciden con el filtro, después de omitir los primeros `skip`.
 */
router.post('/skip', async (req, res) => {
    const db = getDB();
    const { collection, filter = {}, skip = 0 } = req.body;

    if (!collection) {
        return res.status(400).json({ error: 'Falta el nombre de la colección' });
    }

    try {
        const docs = await db.collection(collection)
            .find(filter)
            .skip(skip)
            .toArray();

        res.json({ results: docs });
    } catch (error) {
        console.error('Error al consultar con skip:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

/**
 * POST /limit
 * Consulta documentos desde una colección aplicando un valor de 'limit' para restringir el número de resultados.
 * 
 * Body esperado:
 * {
 *      collection - Nombre de la colección a consultar (obligatorio).
 *      filter - Filtro MongoDB para buscar documentos.
 *      limit - Cantidad máxima de documentos a retornar.
 * }
 * 
 * Respuesta:
 * Lista de documentos que coinciden con el filtro, limitada a `limit` resultados.
 */
router.post('/limit', async (req, res) => {
    const db = getDB();
    const { collection, filter = {}, limit = 10 } = req.body;

    if (!collection) {
        return res.status(400).json({ error: 'Falta el nombre de la colección' });
    }

    try {
        const docs = await db.collection(collection)
            .find(filter)
            .limit(limit)
            .toArray();

        res.json({ results: docs });
    } catch (error) {
        console.error('Error al consultar con limit:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

export default router;