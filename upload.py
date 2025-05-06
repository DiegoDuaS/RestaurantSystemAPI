import json
from pymongo import MongoClient, errors
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Conectar a MongoDB
client = MongoClient(MONGO_URI)
db = client["Proyecto2"]

# Ruta de los archivos
folder_path = "files"

# Diccionario con el nombre de archivo y su colección destino
archivos_y_colecciones = {
    "restaurantes.json": "restaurantes",
    "usuarios.json": "usuarios",
    "articulos_menu.json": "articulos_menu",
    "ordenes.json": "ordenes",
    "resenas.json": "resenas"
}

try:
    # Intentar conectar al cliente MongoDB
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)  # 5 segundos de espera
    client.admin.command('ping')  # Verificar si la conexión funciona
    db = client["Proyecto2"]
    print("✅ Conexión exitosa a MongoDB Atlas")
    

    # Cargar cada archivo y subirlo a su colección correspondiente
    for archivo, nombre_coleccion in archivos_y_colecciones.items():
        ruta_completa = os.path.join(folder_path, archivo)
        
        with open(ruta_completa, "r", encoding="utf-8") as f:
            datos = json.load(f)
            if isinstance(datos, list):
                db[nombre_coleccion].insert_many(datos)
            else:
                db[nombre_coleccion].insert_one(datos)

        print(f"Datos insertados en la colección '{nombre_coleccion}' ✅")

except errors.OperationFailure:
    print("❌ Error de autenticación: revisa usuario, contraseña o permisos en MongoDB Atlas.")
except errors.ConfigurationError:
    print("❌ URI de conexión mal formado o incompleto.")
except errors.ConnectionFailure:
    print("❌ No se pudo conectar al servidor: revisa tu conexión a internet o la URI.")
except Exception as e:
    print(f"❌ Error inesperado durante la conexión: {e}")
