from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Conexión a la base de datos
def connect_db():
    return sqlite3.connect('database.db')

# Ruta para cargar el HTML
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para obtener personajes
@app.route('/get_characters', methods=['GET'])
def get_characters():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT name, class, current_level, is_party_master, is_mule FROM characters")
    characters = cursor.fetchall()
    conn.close()
    return jsonify(characters)

# Ruta para agregar personajes
@app.route('/add_character', methods=['POST'])
def add_character():
    data = request.get_json()
    print(data)
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO characters (name, class, current_level, to_buy, to_sell, email, id_mugp, password, is_party_master, is_mule)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (data['name'], data['class'], data['level'], data['to_buy'], data['to_sell'], data['email'], data['id_mugp'], data['password'], data['is_party_master'], data['is_mule'])
    )
    print("Datos insertados")
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/delete_character/<int:id>', methods=['DELETE'])
def delete_character(id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM characters WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})


@app.route('/get_parties', methods=['GET'])
def get_parties():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, level FROM parties")  # Ajusta la consulta según tu estructura de tabla
    parties = cursor.fetchall()
    conn.close()
    
    # Formatear los datos de parties para enviarlos al frontend
    parties_data = []
    for party in parties:
        party_id, name, level = party
        # Suponiendo que tienes una tabla para los miembros del party, realiza una consulta para obtenerlos
        cursor = connect_db().cursor()
        cursor.execute("SELECT name FROM characters WHERE party_id = ?", (party_id,))
        members = [member[0] for member in cursor.fetchall()]
        
        parties_data.append({
            'id': party_id,
            'name': name,
            'level': level,
            'members': members
        })

    return jsonify(parties_data)




if __name__ == '__main__':
    app.run(debug=True)
