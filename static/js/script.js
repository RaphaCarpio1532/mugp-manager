// ================================
// Variables Globales y Estado
// ================================
let isEditing = false;             // Indica si se está editando un personaje
let currentCharacterId = null;     // ID del personaje actual en edición
let isEditingParty = false;        // Indica si se está editando un party
let currentPartyId = null;         // ID del party actual en edición

const partyModal = document.getElementById('party-modal');  // Referencia global al modal de parties
// ================================
// Funciones Auxiliares
// ================================

//cargar los personajes para el select del formulario de party
function loadPartyMembers() {
    return fetch('/api/get_characters')
        .then(response => response.json())
        .then(data => {
            const select = document.querySelector('#party-members');
            select.innerHTML = '';
            data.forEach(character => {
                const option = document.createElement('option');
                option.value = character[9];  // El ID del personaje
                option.textContent = `${character[0]} - Nivel ${character[2]}`;  // Nombre y nivel
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar personajes para el party:', error);
            throw error;  // Re-lanzamos el error para manejarlo en el llamado
        });
}

// Restablecer el formulario de party
function resetPartyForm() {
    document.querySelector('#create-party-form').reset();
    const partyMembersSelect = document.getElementById('party-members');
    Array.from(partyMembersSelect.options).forEach(option => {
        option.selected = false;
    });
    document.querySelector('#party-modal h2').textContent = 'Crear Party';
    document.querySelector('#create-party-form button[type="submit"]').textContent = 'Crear Party';
}

// Cargar las clases y llenar el select correspondiente
function loadClasses() {
    fetch('/api/get_classes')
        .then(response => response.json())
        .then(data => {
            const classSelect = document.querySelector('#class');
            classSelect.innerHTML = '';
            data.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.class_name;
                classSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las clases:', error));
}

// Restablecer el formulario de personajes
function resetCharacterForm() {
    document.querySelector('#add-character-form').reset();
    document.querySelector('#modal h2').textContent = 'Agregar Personaje';
    document.querySelector('#add-character-form button[type="submit"]').textContent = 'Agregar Personaje';
}

// Restablecer el formulario de party
function resetPartyForm() {
    document.querySelector('#create-party-form').reset();
    const partyMembersSelect = document.getElementById('party-members');
    Array.from(partyMembersSelect.options).forEach(option => {
        option.selected = false;
    });
    document.querySelector('#party-modal h2').textContent = 'Crear Party';
    document.querySelector('#create-party-form button[type="submit"]').textContent = 'Crear Party';
}


// ================================
// Inicialización del DOM
// ================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("Archivo de script cargado");

    // Variables para los modales y botones
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal-button');
    const closeModalButton = document.getElementById('close-modal-button');
    const openPartyModalButton = document.getElementById('open-party-modal-button');
    const closePartyModalButton = document.getElementById('close-party-modal-button');

    // Inicializar funciones
    loadCharacters();
    loadParties();
    loadClasses();

    // ================================
    // Event Listeners - Modal de Personajes
    // ================================
    openModalButton.addEventListener('click', () => {
        isEditing = false;
        currentCharacterId = null;
        resetCharacterForm();
        modal.style.display = 'flex';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

  // ================================
    // Event Listeners - Modal de Parties
    // ================================
    openPartyModalButton.addEventListener('click', () => {
        isEditingParty = false;
        currentPartyId = null;
        resetPartyForm();
        loadPartyMembers(); // Cargar miembros disponibles antes de abrir el modal
        partyModal.style.display = 'flex';
    });

    closePartyModalButton.addEventListener('click', () => {
        partyModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === partyModal) {
            partyModal.style.display = 'none';
        }
    });

  // ================================
    // Event Listener - Formulario de Personaje
    // ================================
    document.querySelector('#add-character-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío predeterminado del formulario
        if (isEditing) {
            updateCharacter(currentCharacterId); // Llama a la función para actualizar
        } else {
            addCharacter(); // Llama a la función para agregar
        }
    });

// ================================
    // Event Listener - Formulario de Party
    // ================================
    document.querySelector('#create-party-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const partyName = document.querySelector('#party-name').value;
        const selectedCharacters = Array.from(document.querySelector('#party-members').selectedOptions).map(option => option.value);

        const partyData = {
            party_name: partyName,
            character_ids: selectedCharacters
        };

        // Lógica para crear o actualizar un party según el estado (isEditingParty)
        if (isEditingParty) {
            updateParty(currentPartyId, partyData);
        } else {
            createParty(partyData);
        }
    });
});

// ================================
// Funciones - CRUD de Personajes
// ================================
// ================================
// Cargar y mostrar los personajes en la tabla
// ================================
function loadCharacters() {
    fetch('/api/get_characters')
        .then(response => response.json())
        .then(data => {
            const charactersTable = document.querySelector('#characters-table tbody');
            charactersTable.innerHTML = '';
            data.forEach(character => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${character[0]}</td>
                    <td>${character[1]}</td>
                    <td>${character[2]}</td>
                    <td>${character[3]}</td>
                    <td>${character[4]}</td>
                    <td>${character[5]}</td>
                    <td>${character[6]}</td>
                    <td>${character[7] ? 'Sí' : 'No'}</td>
                    <td>${character[8] ? 'Sí' : 'No'}</td>
                    <td>
                        <button class="edit-button" onclick="editCharacter(${character[9]})">Modificar</button>
                        <button class="delete-button" onclick="deleteCharacter(${character[9]})">Eliminar</button>
                    </td>
                `;
                charactersTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar personajes:', error));
}
// ================================
// Agregar un personaje
// ================================
function addCharacter() {
    const characterData = {
        name: document.querySelector('#name').value,
        class_id: document.querySelector('#class').value,
        level: document.querySelector('#level').value,
        to_buy: document.querySelector('#to_buy').value,
        to_sell: document.querySelector('#to_sell').value,
        email: document.querySelector('#email').value,
        id_mugp: document.querySelector('#id_mugp').value,
        password: document.querySelector('#password').value,
        is_party_master: document.querySelector('#is_party_master').checked,
        is_mule: document.querySelector('#is_mule').checked
    };

    fetch('/api/add_character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Personaje agregado exitosamente!');
            loadCharacters();
            document.getElementById('modal').style.display = 'none';
        }
    })
    .catch(error => console.error('Error al agregar personaje:', error));
}
// ================================
// Editar un personaje (cargar datos en el formulario)
// ================================
window.editCharacter = function(characterId) {
    fetch(`/api/get_character/${characterId}`)
        .then(response => response.json())
        .then(character => {
            isEditing = true;
            currentCharacterId = characterId;

            document.getElementById('name').value = character.name;
            document.getElementById('class').value = character.class_id;
            document.getElementById('level').value = character.level;
            document.getElementById('to_buy').value = character.to_buy;
            document.getElementById('to_sell').value = character.to_sell;
            document.getElementById('email').value = character.email;
            document.getElementById('id_mugp').value = character.id_mugp;
            document.getElementById('password').value = character.password;
            document.getElementById('is_party_master').checked = character.is_party_master;
            document.getElementById('is_mule').checked = character.is_mule;

            document.querySelector('#modal h2').textContent = 'Modificar Personaje';
            document.querySelector('#add-character-form button[type="submit"]').textContent = 'Guardar Cambios';

            document.getElementById('modal').style.display = 'flex';
        })
        .catch(error => console.error('Error al obtener datos del personaje:', error));
}
// ================================
// Actualizar un personaje existente
// ================================
function updateCharacter(characterId) {
    const characterData = {
        name: document.querySelector('#name').value,
        class_id: document.querySelector('#class').value,
        level: document.querySelector('#level').value,
        to_buy: document.querySelector('#to_buy').value,
        to_sell: document.querySelector('#to_sell').value,
        email: document.querySelector('#email').value,
        id_mugp: document.querySelector('#id_mugp').value,
        password: document.querySelector('#password').value,
        is_party_master: document.querySelector('#is_party_master').checked,
        is_mule: document.querySelector('#is_mule').checked
    };

    fetch(`/api/update_character/${characterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Personaje actualizado correctamente.');
            loadCharacters();
            document.getElementById('modal').style.display = 'none';
            isEditing = false;
        }
    })
    .catch(error => console.error('Error al actualizar personaje:', error));
}
// ================================
// Eliminar un personaje
// ================================
window.deleteCharacter = function(characterId) {
    fetch(`/api/delete_character/${characterId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Personaje eliminado correctamente.');
            loadCharacters();
        }
    })
    .catch(error => console.error('Error al eliminar personaje:', error));
}

// ================================
// Funciones - CRUD de Parties
// ================================
// ================================
// Cargar y mostrar los parties
// ================================
function loadParties() {
    fetch('/api/get_parties')
        .then(response => response.json())
        .then(data => {
            const partiesContainer = document.querySelector('#parties-container');
            partiesContainer.innerHTML = '';
            data.forEach(party => {
                const partyBox = document.createElement('div');
                partyBox.classList.add('party-box');
                partyBox.innerHTML = `
                    <h3>${party.party_name}</h3>
                    <ul>
                        ${party.members.map(member => `
                            <li>
                                ${member.name} - ${member.class_name} (Nivel ${member.level})
                            </li>
                        `).join('')}
                    </ul>
                    <div class="party-actions">
                        <button class="edit-party-button" onclick="editParty(${party.id})">Editar</button>
                        <button class="delete-party-button" onclick="deleteParty(${party.id})">Eliminar</button>
                    </div>
                `;
                partiesContainer.appendChild(partyBox);
            });
        });
}


// ================================
// Crear un nuevo party
// ================================
function createParty(partyData) {
    fetch('/api/create_party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            alert('Party creado exitosamente!');
            loadParties(); // Recargar la lista de parties después de crear
            document.getElementById('party-modal').style.display = 'none'; // Cerrar modal
            resetPartyForm(); // Restablecer el formulario de party
        } else {
            console.error('Error al crear el party:', data.message);
            alert(`Error al crear el party: ${data.message}`);
        }
    })
    .catch(error => console.error('Error al crear el party:', error));
}



// ================================
// Función para editar un Party
// ================================
window.editParty = function(partyId) {
    // Obtener los datos del party
    fetch(`/api/get_party/${partyId}`)
        .then(response => response.json())
        .then(party => {
            // Cargar los personajes en el select primero
            loadPartyMembers()
                .then(() => {
                    // Configuración para editar el party existente
                    isEditingParty = true;
                    currentPartyId = partyId;

                    // Llenar el formulario del modal con los datos del party
                    document.getElementById('party-name').value = party.party_name;

                    // Seleccionar los miembros actuales en el select
                    const partyMembersSelect = document.getElementById('party-members');
                    Array.from(partyMembersSelect.options).forEach(option => {
                        option.selected = party.members.some(member => member.id === parseInt(option.value));
                    });

                    // Cambiar el título y el texto del botón
                    document.querySelector('#party-modal h2').textContent = 'Modificar Party';
                    document.querySelector('#create-party-form button[type="submit"]').textContent = 'Guardar Cambios';

                    // Mostrar el modal para editar
                    document.getElementById('party-modal').style.display = 'flex';
                })
                .catch(error => console.error('Error al cargar personajes para el select:', error));
        })
        .catch(error => console.error('Error al obtener datos del party:', error));
};


// Actualizar un party existente
function updateParty(partyId, partyData) {
    fetch(`/api/update_party/${partyId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(partyData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Party actualizado exitosamente!');
            loadParties(); // Recargar la lista de parties después de actualizar
            document.getElementById('party-modal').style.display = 'none';
            isEditingParty = false; // Restablecer el estado
            currentPartyId = null;
            resetPartyForm(); // Restablecer el formulario
        } else {
            console.error('Error al actualizar el party:', data.message);
        }
    })
    .catch(error => console.error('Error al actualizar el party:', error));
}

// Eliminar un party
window.deleteParty = function(partyId) {
    fetch(`/api/delete_party/${partyId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadParties();
        } else {
            alert('Error al eliminar el party.');
        }
    })
    .catch(error => console.error('Error al eliminar party:', error));
}



