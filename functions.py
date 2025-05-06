from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

nombres_articulos_comida = [
    "Pizza Margarita", "Tacos al Pastor", "Hamburguesa Clásica", "Ensalada César", "Sushi de Salmón",
    "Spaghetti Bolognesa", "Pollo Teriyaki", "Arepas Rellenas", "Quesadillas de Queso", "Burrito de Carne",
    "Ceviche de Camarón", "Ramen de Cerdo", "Lasaña de Carne", "Hot Dog Americano", "Nachos con Queso",
    "Pad Thai", "Curry de Pollo", "Panqueques", "Croissant de Chocolate", "Brownie de Chocolate",
    "Helado de Vainilla", "Tarta de Manzana", "Café Latte", "Té Verde", "Jugo Natural",
    "Agua Mineral", "Refresco de Cola", "Limonada", "Smoothie de Mango", "Papas Fritas",
    "Alitas BBQ", "Sopa de Tomate", "Sándwich de Pavo", "Bagel con Queso Crema", "Tostadas Francesas",
    "Donas Glaseadas", "Empanadas de Pollo", "Tamales", "Churros", "Flan de Caramelo",
    "Pescado Frito", "Costillas BBQ", "Sopa de Mariscos", "Ensalada de Atún", "Waffles",
    "Milkshake de Fresa", "Cheesecake de Frutos Rojos", "Té Helado", "Pasta Alfredo", "Hamburguesa Vegetariana",
    "Tostadas de Ceviche", "Macarrones con Queso", "Fajitas de Pollo", "Caldo de Res", "Brochetas de Camarón",
    "Crepas de Nutella", "Huevos Rancheros", "Enchiladas Verdes", "Pozole Rojo", "Pulpo a la Gallega",
    "Tacos de Pescado", "Arroz Chaufa", "Pabellón Criollo", "Gyozas de Cerdo", "Croquetas de Jamón",
    "Camarones al Ajillo", "Bife de Chorizo", "Pastel de Tres Leches", "Pan de Bono", "Arequipe Casero",
    "Chilaquiles Rojos", "Yakisoba", "Empanadas de Queso", "Pastel de Chocolate", "Pollo Frito",
    "Arroz con Leche", "Tamal Oaxaqueño", "Canelones de Carne", "Bebida de Tamarindo", "Bebida de Jamaica",
    "Guacamole", "Torta Cubana", "Hamburguesa de Pollo", "Pasta Carbonara", "Sopa de Cebolla",
    "Sopa de Tortilla", "Batido de Banana", "Café Americano", "Frappe de Caramelo", "Té de Manzanilla",
    "Café Mocha", "Smoothie Verde", "Rollos Primavera", "Atún Sellado", "Brochetas Vegetarianas",
    "Camarones Empanizados", "Albondigas Caseras", "Choripán", "Tostadas de Pollo", "Pollo a la Brasa",
    "Milanesa de Pollo", "Tacos de Barbacoa", "Ropa Vieja", "Pernil Asado", "Mojos de Ajo",
    "Mousse de Limón", "Tortilla Española", "Tacos de Carnitas", "Bebida de Horchata", "Pollo al Curry",
    "Ensalada Caprese", "Pollo Asado con Papas", "Tartaletas de Frutas", "Salmon a la Parrilla", "Risotto de Setas",
    "Tarta de Limón", "Ceviche de Tilapia", "Fideos Chinos con Vegetales", "Filete Mignon", "Sushi de Atún",
    "Pasta Pesto", "Ensalada de Quinoa", "Kebabs de Pollo", "Tacos de Lengua", "Lomo Saltado",
    "Panecillos de Ajo", "Burritos Veganos", "Torta de Carne", "Torta de Jamón y Queso", "Pasta con Pesto de Albahaca",
    "Pasta con Salsa de Tomate", "Alitas Picantes", "Tacos de Cochinita Pibil", "Calamares a la Romana", "Pizza Vegetariana",
    "Paella Valenciana", "Tartar de Salmón", "Curry Vegetal", "Ensalada Griega", "Tostadas de Aguacate",
    "Moussaka", "Tostadas de Pollo con Guacamole", "Sopa de Albóndigas", "Tacos de Pollo a la Parrilla", "Canelones de Espinacas",
    "Pasta Carbonara con Panceta", "Pizza de Pepperoni", "Pollo a la Naranja", "Pescado a la Veracruzana", "Sushi de Pez Mantequilla",
    "Alitas a la Buffalo", "Papas Gajo", "Arroz Basmati con Pollo", "Brochetas de Res", "Sopa Pho"
]


def generar_restaurante(restaurant_id):
    return {
        "_id": restaurant_id,
        "nombre": fake.company(),
        "direccion": fake.address(),
        "tipo": random.choice(["Italiana", "Mexicana", "Japonesa", "Americana", "Vegana", "India"]),
        "horario_atencion": f"{random.randint(8, 11)}:00 AM - {random.randint(8, 11)}:00 PM",
        "tiempo_estimado_entrega": random.randint(10, 60),  # en minutos
        "rating": random.randint(1, 5)
    }

def generar_usuario(user_id):
    return {
        "_id": user_id,
        "nombre": fake.name(),
        "direccion": fake.address(),
        "numero_telefono": fake.phone_number(),
        "correo": fake.email(),
        "numero_tarjeta": fake.credit_card_number(),
        "preferencias": random.sample(["Vegetariano", "Vegano", "Sin gluten", "Carnívoro", "Pescetariano"], k=random.randint(1, 3))
    }

def generar_articulo_menu():
    return {
        "titulo": random.choice(nombres_articulos_comida),
        "descripcion": fake.sentence(),
        "categorias": random.sample(["Entradas", "Plato fuerte", "Postres", "Bebidas"], k=random.randint(1, 2)),
        "precio_individual": round(random.uniform(5.0, 50.0), 2),
        "disponibilidad": random.randint(0, 100),
        "descuentos": round(random.uniform(0.0, 0.5), 2)  # hasta 50% descuento
    }


def generar_orden(num_pedido, cant_usuarios, cant_restaurantes):
    articulos = []
    total_comida = 0

    for _ in range(random.randint(1, 5)):
        articulo_nombre = random.choice(nombres_articulos_comida)
        cantidad = random.randint(1, 3)
        precio = round(random.uniform(5.0, 50.0), 2)
        total_comida += precio * cantidad
        articulos.append({
            "nombre": articulo_nombre,
            "cantidad": cantidad
        })

    propina = round(total_comida * 0.1, 2)
    envio = round(random.uniform(2.0, 8.0), 2)
    total = round(total_comida + propina + envio, 2)

    fecha = fake.date_this_year()
    hora = fake.time()  # Aquí obtenemos la hora como string

    # Si deseas convertir la hora, asegúrate de que sea un objeto `time`
    # Si no, simplemente utiliza `hora` tal como lo obtiene `fake.time()`
    if isinstance(hora, str):
        hora_str = hora  # Usamos la hora tal cual si ya es un string
    else:
        hora_str = hora.strftime('%H:%M:%S')  # Solo si es un objeto `time`

    fecha_str = fecha.strftime('%Y-%m-%d')  # Convertimos la fecha a string

    usuario = random.randint(1, cant_usuarios)
    restaurante = random.randint(1, cant_restaurantes)

    return {
        "id_usuario": usuario,
        "id_restaurante": restaurante,
        "num_pedido": num_pedido,
        "articulos": articulos,
        "total": {
            "propina": propina,
            "envio": envio,
            "comida": round(total_comida, 2),
            "total": total
        },
        "fecha": fecha_str,  # Fecha como string
        "hora": hora_str,    # Usamos la hora (ya sea string o convertida)
        "estado": random.choice(["Completado", "Preparando", "En camino", "Cancelado"])
    }


def generar_resena(user_id, restaurant_id):
    fecha = fake.date_this_year()
    fecha_str = fecha.strftime('%Y-%m-%d')

    return {
        "usuario_id": user_id,
        "restaurante_id": restaurant_id,
        "rating": random.randint(1, 5),
        "comentario": fake.sentence(),
        "fecha": fecha_str  
    }

