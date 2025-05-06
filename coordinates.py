import random
import os
from dotenv import load_dotenv
from pymongo import MongoClient, errors

# Cargar variables de entorno
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["Proyecto2"]
restaurantes = db["restaurantes"]

def coordenadas_aleatorias_usa():
    lat = random.uniform(24.396308, 49.384358)
    lng = random.uniform(-125.0, -66.93457)
    return {
        "type": "Point",
        "coordinates": [lng, lat]
    }

# Actualizar cada restaurante con una ubicación aleatoria
for restaurante in restaurantes.find():
    ubicacion = coordenadas_aleatorias_usa()
    restaurantes.update_one(
        { "_id": restaurante["_id"] },
        { "$set": { "ubicacion": ubicacion } }
    )
    print(f"✅ Ubicación agregada al restaurante {restaurante['nombre']}")

print("✔️ Actualización de coordenadas completada.")
