from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Database Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
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
    name = db.Column(db.String(100), nullable=False)
    members = db.relationship('Character', secondary='party_members', backref='parties')

party_members = db.Table('party_members',
    db.Column('party_id', db.Integer, db.ForeignKey('party.id'), primary_key=True),
    db.Column('character_id', db.Integer, db.ForeignKey('characters.id'), primary_key=True)
)

# Main Route
@app.route('/')
def index():
    return render_template('index.html')

# Endpoint to Get Characters
@app.route('/get_characters', methods=['GET'])
def get_characters():
    characters = Character.query.all()
    characters_list = []
    for char in characters:
        character_class_name = char.character_class.class_name if char.character_class else "Unknown"
        characters_list.append([
            char.name, 
            character_class_name, 
            char.level, 
            char.to_buy, 
            char.to_sell, 
            char.email, 
            char.id_mugp, 
            char.is_party_master, 
            char.is_mule, 
            char.id
        ])
    return jsonify(characters_list)

# Endpoint to Get Classes
@app.route('/get_classes', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    classes_list = [{'id': cls.id, 'class_name': cls.class_name} for cls in classes]
    return jsonify(classes_list)

# Endpoint to Add a Character
@app.route('/add_character', methods=['POST'])
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

# Endpoint to Create a Party
@app.route('/add_party', methods=['POST'])
def add_party():
    data = request.get_json()
    new_party = Party(name=data['party_name'])
    db.session.add(new_party)
    db.session.commit()
    # Add members to the party
    for char_id in data['character_ids']:
        character = Character.query.get(char_id)
        if character:
            new_party.members.append(character)
    db.session.commit()
    return jsonify({'status': 'success'})

# Endpoint to Get Parties
@app.route('/get_parties', methods=['GET'])
def get_parties():
    parties = Party.query.all()
    parties_list = [{
        'party_name': party.name,
        'members': [{'name': member.name, 'level': member.level} for member in party.members],
        'id': party.id
    } for party in parties]
    return jsonify(parties_list)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they do not exist
    app.run(debug=True)
