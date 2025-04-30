import express from 'express';
import { getDB } from './mongoDB-connection.js';

const router = express.Router();

router.post('/create/oneDocument', async (req, res) => {
    try {
        const db = getDB();
        const { collection, data } = req.body;

        // Validación básica
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({ error: 'Nombre de la colección inválido o ausente.' });
        }

        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Datos del documento inválidos o ausentes.' });
        }

        // Inserta el documento en la colección
        const result = await db.collection(collection).insertOne(data);

        return res.status(201).json({
            message: 'Documento creado exitosamente.'
        });
    } catch (error) {
        console.error('Error al insertar el documento:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

export default router;


