-- Crea la tabla de parties
CREATE TABLE parties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER,
    map TEXT
);

-- Crea la tabla de characters
CREATE TABLE characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT,
    current_level INTEGER,
    id_mugp TEXT,
    password TEXT,
    email TEXT,
    to_buy TEXT,
    to_sell TEXT,
    is_party_master BOOLEAN,
    is_mule BOOLEAN,
    party_id INTEGER,
    FOREIGN KEY(party_id) REFERENCES parties(id)
);
