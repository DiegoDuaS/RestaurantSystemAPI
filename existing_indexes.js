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
    await ordenes.createIndex({ estado: -1 });
    console.log('Índices simples creados');

    // Indices Compuestos: sobre 2 o mas campos
    await restaurantes.createIndex({ nombre: 1, direccion: 1, rating: 1 })
    await articulosMenu.createIndex({ categorias: 1, precio_individual: 1 })
    await articulosMenu.createIndex({ titulo: 1, disponibilidad: 1 })
    await ordenes.createIndex({ id_restaurante: 1, fecha: 1, estado: 1 })
    await resenas.createIndex({ restaurante_id: 1, rating: 1 })
    await resenas.createIndex({ usuario_id: 1, restaurante_id: 1 })
    await restaurantes.createIndex({ rating: 1, tiempo_estimado_entrega: 1 })
    await ordenes.createIndex({ "id_usuario": 1, "estado": 1 })
    console.log('Índices compuestos creados');

    // Índice multikey: sobre un array
    await articulosMenu.createIndex({ categorias: 1 });
    await usuarios.createIndex({ preferencias: 1 });
    console.log('Índices multikey creados"');

    // Crear índice geoespacial en el nuevo campo
    await restaurantes.createIndex({ "ubicacion": "2dsphere" });
    console.log('Índices geoespaciales procesados');

    // Índice de texto para búsquedas en múltiples campos
    await restaurantes.createIndex({ nombre: "text", tipo: "text", direccion: "text" });
    await articulosMenu.createIndex({ titulo: "text", descripcion: "text" });
    await resenas.createIndex({ comentario: "text" });
    console.log('Índices de texto creados');
    
  } catch (error) {
    console.error('Error al crear índices:', error);
  }
}

crearIndices();
