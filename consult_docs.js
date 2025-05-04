import express from 'express';
import { getDB } from './mongoDB-connection.js';

const router = express.Router();


/**
 * POST /filter
 * Consulta documentos aplicando filtros específicos.
 * 
 * Body esperado:
 * {
 *      collection - Nombre de la colección a consultar (obligatorio).
 *      filter - Filtro MongoDB para buscar documentos (ej: { rating: { $gte: 4 } }).
 * }
 * 
 * Respuesta:
 * Lista de documentos que coinciden con el filtro.
 */
router.post('/filter', async (req, res) => {
    const db = getDB();
    const { collection, filter = {} } = req.body;

    if (!collection) {
        return res.status(400).json({ error: 'Falta el nombre de la colección' });
    }

    try {
        const docs = await db.collection(collection)
            .find(filter)
            .toArray();

        res.json({ 
            count: docs.length,
            results: docs 
        });
    } catch (error) {
        console.error('Error al aplicar filtro:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

/**
 * POST /projection
 * Consulta documentos y devuelve solo los campos especificados.
 * 
 * Body esperado:
 * {
 *      collection - Nombre de la colección a consultar (obligatorio).
 *      filter - Filtro MongoDB para buscar documentos (opcional).
 *      projection - Campos a incluir/excluir (ej: { name: 1, address: 1, _id: 0 }).
 * }
 * 
 * Respuesta:
 * Lista de documentos con solo los campos proyectados.
 */
router.post('/projection', async (req, res) => {
    const db = getDB();
    const { collection, filter = {}, projection = {} } = req.body;

    if (!collection) {
        return res.status(400).json({ error: 'Falta el nombre de la colección' });
    }

    if (Object.keys(projection).length === 0) {
        return res.status(400).json({ error: 'Debes especificar al menos un campo en la proyección' });
    }

    try {
        const docs = await db.collection(collection)
            .find(filter)
            .project(projection)
            .toArray();

        res.json({ 
            count: docs.length,
            results: docs 
        });
    } catch (error) {
        console.error('Error al aplicar proyección:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});


/**
 * POST /sort
 * Consulta documentos ordenados según criterios específicos.
 * 
 * Body esperado:
 * {
 *      collection - Nombre de la colección a consultar (obligatorio).
 *      filter - Filtro MongoDB para buscar documentos (opcional).
 *      sort - Criterios de ordenamiento (ej: { rating: -1, name: 1 }).
 * }
 * 
 * Respuesta:
 * Lista de documentos ordenados según el criterio.
 */
router.post('/sort', async (req, res) => {
    const db = getDB();
    const { collection, filter = {}, sort = {} } = req.body;

    if (!collection) {
        return res.status(400).json({ error: 'Falta el nombre de la colección' });
    }

    if (Object.keys(sort).length === 0) {
        return res.status(400).json({ error: 'Debes especificar al menos un campo para ordenar' });
    }

    try {
        const docs = await db.collection(collection)
            .find(filter)
            .sort(sort)
            .toArray();

        res.json({ 
            count: docs.length,
            results: docs 
        });
    } catch (error) {
        console.error('Error al aplicar ordenamiento:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

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