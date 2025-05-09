import express from 'express';
import { getDB } from './mongoDB-connection.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

/**
 * PUT /update/oneDocument
 * 
 * Endpoint para actualizar un solo documento en una colección específica.
 * 
 * Body esperado:
 * {
 *   "collection": "nombre_de_la_coleccion",     // Nombre de la colección a actualizar
 *   "filter": { ... },                          // Filtro para encontrar el documento
 *   "update": { "$set": { ... } }               // Objeto de actualización (puede usar $set, $inc, etc.)
 * }
 * 
 * Respuesta:
 * {
 *   "matchedCount": Número de documentos que coincidieron con el filtro,
 *   "modifiedCount": Número de documentos modificados,
 *   "acknowledged": true/false
 * }
 * 
 * Errores posibles:
 * - Falta de datos en el body
 * - Error de conexión o ejecución en la base de datos
 */
router.put('/update/oneDocument', async (req, res) => {
    const db = getDB();
    const { collection, filter, update } = req.body;

    // Validación básica
    if (!collection || !filter || !update) {
        return res.status(400).json({ error: 'Faltan datos: collection, filter o update.' });
    }

    try {
        const col = db.collection(collection);

        // Si el filtro NO está vacío, validar el uso de índice
        if (Object.keys(filter).length > 0) {
            const explain = await col.find(filter).explain("executionStats");
            const stage = explain.executionStats.executionStages;

            const isCollscan = s =>
                s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN");

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Actualización rechazada: el filtro no usa un índice (COLLSCAN detectado)'
                });
            }
        }

        if (filter._id && typeof filter._id === 'string') {
            if (ObjectId.isValid(filter._id)) {
               filter._id = new ObjectId(filter._id);
            } else {
               return res.status(400).json({ error: 'El _id proporcionado no es válido' });
            }
        }

        const result = await col.updateOne(filter, update);

        res.json({
            modifiedCount: result.modifiedCount,
            acknowledged: result.acknowledged
        });
    } catch (error) {
        console.error('Error al actualizar el documento: ', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    } 
});


/**
 * PUT /update/manyDocuments
 * 
 * Endpoint para actualizar múltiples documentos en una colección específica.
 * 
 * Body esperado:
 * {
 *   "collection": "nombre_de_la_coleccion",     // Nombre de la colección
 *   "filter": { ... },                          // Filtro para seleccionar los documentos
 *   "update": { "$set": { ... } }               // Objeto de actualización (usa operadores como $set, $unset, etc.)
 * }
 * 
 * Respuesta:
 * {
 *   "matchedCount": Número de documentos que coincidieron con el filtro,
 *   "modifiedCount": Número de documentos modificados,
 *   "acknowledged": true/false
 * }
 * 
 * Errores posibles:
 * - Faltan campos requeridos en el body
 * - Error interno en la base de datos
 */
router.put('/update/manyDocuments', async (req, res) => {
    const db = getDB();
    const { collection, filter, update } = req.body;

    // Validación mínima
    if (!collection || !filter || !update) {
        return res.status(400).json({ error: 'Faltan datos: collection, filter o update.' });
    }

    try {
        
        const col = db.collection(collection);

        // Si el filtro NO está vacío, validar el uso de índice
        if (Object.keys(filter).length > 0) {
            const explain = await col.find(filter).explain("executionStats");
            const stage = explain.executionStats.executionStages;

            const isCollscan = s =>
                s.stage === "COLLSCAN" || 
                (s.inputStage && s.inputStage.stage === "COLLSCAN");

            if (isCollscan(stage)) {
                return res.status(400).json({
                    error: 'Actualización rechazada: el filtro no usa un índice (COLLSCAN detectado)'
                });
            }
        }

        if (filter._id && typeof filter._id === 'string') {
            if (ObjectId.isValid(filter._id)) {
               filter._id = new ObjectId(filter._id);
            } else {
               return res.status(400).json({ error: 'El _id proporcionado no es válido' });
            }
        }

        const result = await col.updateMany(filter, update);

        res.json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            acknowledged: result.acknowledged
        });
    } catch (error) {
        console.error('Error al actualizar documentos: ', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});



export default router;