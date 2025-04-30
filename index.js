import express, { json } from 'express';
import cors from 'cors';
import { connectToMongo } from './mongoDB-connection.js';

const app = express();
app.use(cors());
app.use(json());

app.get('/status', (req, res) => {
    res.json({ message: 'API funcionando correctamente 🚀' });
});

// Importar las rutas
import createDocs from './create_docs.js';
app.use('', createDocs);

import consultDocs from './consult_docs.js';
app.use('', consultDocs);

import updateDocs from './update_docs.js';
app.use('', updateDocs);

import deleteDocs from './delete_docs.js';
app.use('', deleteDocs);

// Completar conexión
connectToMongo()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor escuchando en puerto 3000");
    });
  })
  .catch((err) => {
    console.error("No se pudo iniciar el servidor por error en MongoDB", err);
  });