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
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})


if __name__ == '__main__':
    app.run(debug=True)
