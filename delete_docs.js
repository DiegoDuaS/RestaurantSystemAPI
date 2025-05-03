import express from 'express';
import { getDB } from './mongoDB-connection.js';

const router = express.Router();

router.delete('/delete/oneDocument', async (req, res) => {
    try {
        const db = getDB();
        const { collection, filter } = req.body;

        // Validación básica
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({ error: 'Nombre de la colección inválido o ausente.' });
        }

        if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar un filtro válido.' });
        }

        // Eliminar el documento basado en el filtro proporcionado
        const result = await db.collection(collection).deleteOne(filter);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No se encontró ningún documento que coincida con el filtro.' });
        }

        return res.status(200).json({ message: 'Documento eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el documento:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.delete('/delete/multipleDocuments', async (req, res) => {
    try {
        const db = getDB();
        const { collection, filter } = req.body;

        // Validación básica
        if (!collection || typeof collection !== 'string') {
            return res.status(400).json({ error: 'Nombre de la colección inválido o ausente.' });
        }

        if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
            return res.status(400).json({ error: 'Debe proporcionar un filtro válido.' });
        }

        // Eliminar los documentos basados en el filtro proporcionado
        const result = await db.collection(collection).deleteMany(filter);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No se encontraron documentos que coincidan con el filtro.' });
        }

        return res.status(200).json({ message: `${result.deletedCount} documentos eliminados exitosamente.` });
    } catch (error) {
        console.error('Error al eliminar documentos:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});



export default router;