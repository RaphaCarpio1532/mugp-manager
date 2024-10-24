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
    cursor.execute('''
        SELECT c.name, cl.class_name, c.current_level, c.is_party_master, c.is_mule 
        FROM characters c
        JOIN classes cl ON c.class_id = cl.id
    ''')
    characters = cursor.fetchall()
    conn.close()
    return jsonify(characters)

# Ruta para agregar personajes
@app.route('/add_character', methods=['POST'])
def add_character():
    data = request.get_json()
    print(data)
    
    # Asegurarnos de que 'is_party_master' y 'is_mule' tengan valores predeterminados
    is_party_master = data.get('is_party_master', False)  # False si no está presente
    is_mule = data.get('is_mule', False)  # False si no está presente
    
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO characters (name, class_id, current_level, to_buy, to_sell, email, id_mugp, password, is_party_master, is_mule)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (data['name'], data['class'], data['level'], data['to_buy'], data['to_sell'], data['email'], data['id_mugp'], data['password'], is_party_master, is_mule)
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


@app.route('/add_party', methods=['POST'])
def add_party():
    data = request.json
    party_name = data['party_name']
    character_ids = data['character_ids']  # Lista de IDs de personajes seleccionados
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # Insertar el party
    cursor.execute('INSERT INTO parties (party_name) VALUES (?)', (party_name,))
    party_id = cursor.lastrowid
    
    # Insertar los personajes en el party
    for character_id in character_ids:
        cursor.execute('INSERT INTO party_members (party_id, character_id) VALUES (?, ?)', (party_id, character_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success'})

# Ruta para obtener los parties y sus miembros
@app.route('/get_parties', methods=['GET'])
def get_parties():
    conn = connect_db()
    cursor = conn.cursor()
    
    # Obtener todos los parties
    cursor.execute("SELECT id, party_name FROM parties")
    parties = cursor.fetchall()

    parties_list = []
    
    # Iterar sobre cada party y obtener sus miembros
    for party in parties:
        party_id, party_name = party
        
        # Obtener los miembros del party
        cursor.execute('''
            SELECT c.name, c.current_level
            FROM party_members pm
            JOIN characters c ON pm.character_id = c.id
            WHERE pm.party_id = ?
        ''', (party_id,))
        
        members = cursor.fetchall()
        member_list = [{'name': member[0], 'level': member[1]} for member in members]
        
        # Formatear la información del party
        parties_list.append({
            'id': party_id,
            'party_name': party_name,
            'members': member_list
        })

    conn.close()
    return jsonify(parties_list)



if __name__ == '__main__':
    app.run(debug=True)
