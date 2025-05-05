import { connectToMongo, getDB } from './mongoDB-connection.js';

async function crearIndices() {
  try {
    await connectToMongo();
    const db = getDB();
    const articulosMenu = db.collection('articulos_menu');
    const ordenes = db.collection('ordenes');
    const resenas = db.collection('resenas');
    const restaurantes = db.collection('restaurantes');
    const usuarios = db.collection('usuarios');

    // Índices simples: sobre un campo individual
    await restaurantes.createIndex({ nombre: 1 });
    await restaurantes.createIndex({ tipo: 1 });
    await restaurantes.createIndex({ rating: -1 });
    await resenas.createIndex({ rating: -1 });
    console.log('Índices simples creados');

    // Índice multikey: sobre un array
    await articulosMenu.createIndex({ categorias: 1 });
    await usuarios.createIndex({ preferencias: 1 });
    console.log('Índices multikey creados"');

    // Índice geoespaciales

    // Índice de texto para búsquedas en múltiples campos

  } catch (error) {
    console.error('Error al crear índices:', error);
  }
}

crearIndices();
