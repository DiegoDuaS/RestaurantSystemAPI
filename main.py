import functions
import os
import json
import random

def guardar_json(nombre_archivo, datos):
    ruta = os.path.join('files', nombre_archivo)
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

# Crear carpeta files/ si no existe
os.makedirs('files', exist_ok=True)

# Configuraciones de cantidad
CANT_RESTAURANTES = 100
CANT_ARTICULOS = 150
CANT_USUARIOS = 15000
CANT_ORDENES = 50000
CANT_RESENAS = 30000

# Generar datos
print("Generando restaurantes...")
restaurantes = [functions.generar_restaurante(i) for i in range(1, CANT_RESTAURANTES + 1)]

print("Generando usuarios...")
usuarios = [functions.generar_usuario(i) for i in range(1, CANT_USUARIOS + 1)]

print("Generando artículos del menú...")
articulos = [functions.generar_articulo_menu() for i in range(1, 100)]

print("Generando órdenes...")
ordenes = [functions.generar_orden(i, CANT_USUARIOS, CANT_RESTAURANTES) for i in range(1, CANT_ORDENES + 1)]

print("Generando reseñas...")
resenas = []
for _ in range(CANT_RESENAS):
    user_id = random.randint(1, CANT_USUARIOS)
    restaurant_id = random.randint(1, CANT_RESTAURANTES)
    resenas.append(functions.generar_resena(user_id, restaurant_id))

# Guardar en archivos
print("Guardando archivos en carpeta 'files'...")
guardar_json('restaurantes.json', restaurantes)
guardar_json('usuarios.json', usuarios)
guardar_json('articulos_menu.json', articulos)
guardar_json('ordenes.json', ordenes)
guardar_json('resenas.json', resenas)

print("¡Todo listo! Archivos guardados en carpeta 'files/' ✅")