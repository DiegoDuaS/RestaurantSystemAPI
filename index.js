import express from 'express';
import { connectToMongo } from './mongoDB-connection.js';

const app = express();
app.use(express.json());

connectToMongo()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor escuchando en puerto 3000");
    });
  })
  .catch((err) => {
    console.error("No se pudo iniciar el servidor por error en MongoDB", err);
  });
