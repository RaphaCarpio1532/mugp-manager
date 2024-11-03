from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# ==============================
# Configuración de Base de Datos
# ==============================

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==============================
# Definición de Modelos
# ==============================

class Character(db.Model):
    __tablename__ = 'characters'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    to_buy = db.Column(db.String(200))
    to_sell = db.Column(db.String(200))
    email = db.Column(db.String(100), nullable=False)
    id_mugp = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    is_party_master = db.Column(db.Boolean, default=False)
    is_mule = db.Column(db.Boolean, default=False)
    character_class = db.relationship('Class', backref='characters')

class Class(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(100), nullable=False)

class Party(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    party_name = db.Column(db.String(100), nullable=False)
    members = db.relationship('Character', secondary='party_members', backref='parties')

party_members = db.Table('party_members',
    db.Column('party_id', db.Integer, db.ForeignKey('party.id'), primary_key=True),
    db.Column('character_id', db.Integer, db.ForeignKey('characters.id'), primary_key=True)
)

# ==============================
# Rutas para Renderizado HTML
# ==============================

@app.route('/')
def homepage():
    return render_template('index.html')

# ==============================
# Rutas de API - CRUD de Personajes
# ==============================

@app.route('/api/get_characters', methods=['GET'])
def get_characters():
    characters = Character.query.all()
    characters_list = [
        [
            char.name,
            char.character_class.class_name if char.character_class else "Unknown",
            char.level,
            char.to_buy,
            char.to_sell,
            char.email,
            char.id_mugp,
            char.is_party_master,
            char.is_mule,
            char.id
        ]
        for char in characters
    ]
    return jsonify(characters_list)

@app.route('/api/get_classes', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    classes_list = [{'id': cls.id, 'class_name': cls.class_name} for cls in classes]
    return jsonify(classes_list)

@app.route('/api/add_character', methods=['POST'])
def add_character():
    try:
        data = request.get_json()
        new_character = Character(
            name=data['name'],
            class_id=data['class_id'],
            level=data['level'],
            to_buy=data.get('to_buy'),
            to_sell=data.get('to_sell'),
            email=data['email'],
            id_mugp=data['id_mugp'],
            password=data['password'],
            is_party_master=data.get('is_party_master', False),
            is_mule=data.get('is_mule', False)
        )
        db.session.add(new_character)
        db.session.commit()
        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"Error al agregar personaje: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/update_character/<int:character_id>', methods=['PUT'])
def update_character(character_id):
    data = request.get_json()
    character = Character.query.get(character_id)
    if character:
        character.name = data['name']
        character.class_id = data['class_id']
        character.level = data['level']
        character.to_buy = data.get('to_buy')
        character.to_sell = data.get('to_sell')
        character.email = data['email']
        character.id_mugp = data['id_mugp']
        character.password = data['password']
        character.is_party_master = data.get('is_party_master', False)
        character.is_mule = data.get('is_mule', False)
        db.session.commit()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Personaje no encontrado'})

@app.route('/api/delete_character/<int:character_id>', methods=['DELETE'])
def delete_character(character_id):
    character = Character.query.get(character_id)
    if character:
        db.session.delete(character)
        db.session.commit()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Personaje no encontrado'})

# ==============================
# Rutas de API - Gestión de Parties
# ==============================

@app.route('/api/create_party', methods=['POST'])
def create_party():
    data = request.get_json()
    new_party = Party(name=data['party_name'])
    db.session.add(new_party)
    db.session.commit()
    for char_id in data['character_ids']:
        character = Character.query.get(char_id)
        if character:
            new_party.members.append(character)
    db.session.commit()
    return jsonify({'status': 'success'})

@app.route('/api/get_parties', methods=['GET'])
def get_parties():
    parties = Party.query.all()
    parties_list = [
        {
            'party_name': party.party_name,
            'members': [{'name': member.name, 'level': member.level} for member in party.members],
            'id': party.id
        }
        for party in parties
    ]
    return jsonify(parties_list)

# ==============================
# Inicialización de la Base de Datos
# ==============================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
