import express from 'express';
import { getDB } from './mongoDB-connection.js';
import { ObjectId } from 'mongodb';

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
        const col = db.collection(collection);

        // Analiza el plan de ejecución
        const explainResult = await col.find(filter).explain("executionStats");
        const executionStage = explainResult.executionStats.executionStages;

        // Si el plan principal es COLLSCAN, la consulta no usó índice
        if (executionStage.stage === "COLLSCAN" || 
            (executionStage.inputStage && executionStage.inputStage.stage === "COLLSCAN")) {
            return res.status(400).json({ 
                error: 'La consulta fue rechazada porque no utiliza ningún índice (COLLSCAN detectado).' 
            });
        }

        // Ejecutar consulta real si pasó el filtro
        const docs = await col.find(filter).toArray();

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
        const col = db.collection(collection);

        // Si el filtro NO está vacío, validar que no haya COLLSCAN
        if (Object.keys(filter).length > 0) {
            const explain = await col.find(filter).project(projection).explain("executionStats");
            const stage = explain.executionStats.executionStages;

            const isCollscan = s =>
                s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN");

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Consulta rechazada: no se está utilizando un índice (COLLSCAN detectado)'
                });
            }
        }

        // Ejecutar la consulta normalmente
        const docs = await col.find(filter).project(projection).toArray();

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
        const col = db.collection(collection);

        // Si el filtro NO está vacío, validar el uso de índice
        if (Object.keys(filter).length > 0) {
            const explain = await col.find(filter).sort(sort).explain("executionStats");
            const stage = explain.executionStats.executionStages;

            const isCollscan = s =>
                s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN");

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Consulta rechazada: no se está utilizando un índice (COLLSCAN detectado)'
                });
            }
        }

        // Ejecutar la consulta normalmente
        const docs = await col.find(filter).sort(sort).toArray();

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
        const col = db.collection(collection);

        // Si el filtro NO está vacío, validar el uso de índice
        if (Object.keys(filter).length > 0) {
            const explain = await col.find(filter).skip(skip).explain("executionStats");
            const stage = explain.executionStats.executionStages;

            const isCollscan = s =>
                s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN");

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Consulta rechazada: no se está utilizando un índice (COLLSCAN detectado)'
                });
            }
        }

        // Ejecutar la consulta normalmente
        const docs = await col.find(filter).skip(skip).toArray();

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
        const col = db.collection(collection);

        // Validar uso de índice si hay filtro
        if (Object.keys(filter).length > 0) {
            const explain = await col.find(filter).limit(limit).explain("executionStats");
            const stage = explain.executionStats.executionStages;

            const isCollscan = s =>
                s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN");

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Consulta rechazada: no se está utilizando un índice (COLLSCAN detectado)'
                });
            }
        }

        const docs = await col.find(filter).limit(limit).toArray();

        res.json({ results: docs });

    } catch (error) {
        console.error('Error al consultar con limit:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});


/**
 * POST /aggregate/query
 * Consulta avanzada usando aggregation pipeline.
 * Permite aplicar filtros ($match), proyecciones ($project), ordenamiento ($sort),
 * paginación con skip ($skip) y límite ($limit), todo en una sola operación.
 * 
 * Body esperado:
 * {
 *    collection - Nombre de la colección a consultar (obligatorio).
 *    match - Objeto de filtrado tipo MongoDB ($match).
 *    project - Objeto de proyección de campos ($project).
 *    sort - Objeto para ordenar resultados ($sort).
 *    skip - Número de documentos a omitir (paginación).
 *    limit - Número máximo de documentos a devolver.
 * }
 * 
 * Respuesta:
 * {
 *    results: [ ...documentos... ],
 *    count: Número de documentos devueltos
 * }
 */
router.post('/aggregate/query', async (req, res) => {
    const db = getDB();
    const {
        collection,
        match = {},
        project,
        sort,
        skip = 0,
        limit = 10
    } = req.body;

    if (!collection) {
        return res.status(400).json({ error: 'Se requiere el nombre de la colección' });
    }

    try {
        if (match._id && typeof match._id === 'string') {
            if (ObjectId.isValid(match._id)) {
               match._id = new ObjectId(match._id);
            } else {
               return res.status(400).json({ error: 'El _id proporcionado no es válido' });
            }
        }

        const pipeline = [];

        if (Object.keys(match).length > 0) {
            pipeline.push({ $match: match });

            // Solo hacer explain si hay $match
            const explain = await db.collection(collection).aggregate(pipeline).explain("executionStats");
            const stage = explain?.stages?.[0]?.$cursor?.executionStats?.executionStages;

            const isCollscan = s =>
                s && (s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN"));

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Agregación rechazada: $match no usa índice (COLLSCAN detectado)'
                });
            }
        }

        if (project) {
            pipeline.push({ $project: project });
        }

        if (sort) {
            pipeline.push({ $sort: sort });
        }

        if (skip > 0) {
            pipeline.push({ $skip: skip });
        }

        if (limit > 0) {
            pipeline.push({ $limit: limit });
        }

        const result = await db.collection(collection).aggregate(pipeline).toArray();

        res.json({ results: result, count: result.length });
    } catch (error) {
        console.error('Error en agregación:', error);
        res.status(500).json({ error: 'Error al ejecutar el pipeline de agregación' });
    }
});


export default router;