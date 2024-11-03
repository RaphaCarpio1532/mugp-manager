-- Crear la base de datos de personajes y parties para el proyecto MUGP

-- Crear tabla de clases
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL
);

-- Insertar datos en la tabla de clases
INSERT INTO classes (class_name) VALUES ('Dark Knight');
INSERT INTO classes (class_name) VALUES ('Dark Wizard');
INSERT INTO classes (class_name) VALUES ('Fairy Elf');
INSERT INTO classes (class_name) VALUES ('Magic Gladiator');
INSERT INTO classes (class_name) VALUES ('Dark Lord');
INSERT INTO classes (class_name) VALUES ('Summoner');
INSERT INTO classes (class_name) VALUES ('Rage Fighter');
INSERT INTO classes (class_name) VALUES ('Grow Lancer');
INSERT INTO classes (class_name) VALUES ('Rune Wizard');

-- Crear tabla de personajes
CREATE TABLE characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    to_buy TEXT,
    to_sell TEXT,
    email TEXT,
    id_mugp TEXT,
    password TEXT,
    is_party_master BOOLEAN DEFAULT FALSE,
    is_mule BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Crear tabla de parties
CREATE TABLE party (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    party_name TEXT NOT NULL
);

-- Crear tabla para asociar miembros a los parties
CREATE TABLE party_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    party_id INTEGER NOT NULL,
    character_id INTEGER NOT NULL,
    FOREIGN KEY (party_id) REFERENCES party(id),
    FOREIGN KEY (character_id) REFERENCES characters(id)
);

-- Datos iniciales para probar
INSERT INTO characters (name, class_id, level, to_buy, to_sell, email, id_mugp, password, is_party_master, is_mule)
VALUES ('test', 2, 1532, 'todo', 'nada', 'r.car@gmail.com', 'test123', 'testpass', FALSE, FALSE);

INSERT INTO characters (name, class_id, level, to_buy, to_sell, email, id_mugp, password, is_party_master, is_mule)
VALUES ('rafasdasd', 1, 1532, 'asdasd', 'asdasd', 'asdasd@gmail.com', 'asdasd', 'pass1', TRUE, TRUE);

INSERT INTO party (party_name) VALUES ('Party A');

INSERT INTO party_members (party_id, character_id) VALUES (1, 1);
INSERT INTO party_members (party_id, character_id) VALUES (1, 2);
