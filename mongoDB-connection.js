import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.CONNECTION_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db("Proyecto2"); // Guarda la instancia de la base de datos
    console.log("Conectado exitosamente a MongoDB");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    throw error;
  }
}

function getDB() {
  if (!db) throw new Error("La base de datos no está conectada aún.");
  return db;
}

function closeMongoConnection() {
  return client.close();
}

export { connectToMongo, getDB, closeMongoConnection };
