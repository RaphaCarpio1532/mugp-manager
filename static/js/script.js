console.log("Archivo de script cargado")
document.addEventListener('DOMContentLoaded', function() {
    loadCharacters(); // Cargar los personajes al cargar la página
    loadParties(); // Cargar los parties al cargar la página
    loadClasses(); // Cargar las clases al cargar la página
});

// Función para cargar y mostrar los personajes
function loadCharacters() {
    fetch('/api/get_characters') //1. Hacer una solicitud a la API Para obener personajes

        .then(response => response.json()) //2. convertir la respuesta en json
 
        .then(data => { //3. procesar los datos obtenidos

            const charactersTable = document.querySelector('#characters-table tbody');
            charactersTable.innerHTML = ''; // Limpiar contenido previo

            data.forEach(character => { //4. Crear y agregar una fila en la tabla por cada personaje
                const row = document.createElement('tr'); //5 Crear un elemento <tr> para la fila
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
                charactersTable.appendChild(row); //6 Añadir la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error('Error al cargar personajes:', error)); //7 manejar errores
}

// Función para cargar las clases y llenar el select correspondiente
function loadClasses() {
    fetch('/api/get_classes')
        .then(response => response.json())
        .then(data => {
            const classSelect = document.querySelector('#class');
            classSelect.innerHTML = ''; // Limpiar opciones previas
            console.log(data); // Verificar datos en consola

            data.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.class_name;
                classSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar las clases:', error));
}

// Función para mostrar el formulario de creación de party
function showCreatePartyForm() {
    const partyFormContainer = document.querySelector('#party-form-container');
    partyFormContainer.style.display = 'block'; // Mostrar el formulario
    
    // Obtener personajes y llenar el select
    fetch('/api/get_characters')
        .then(response => response.json())
        .then(data => {
            const select = document.querySelector('#party-members');
            select.innerHTML = ''; // Limpiar opciones previas

            data.forEach(character => {
                const option = document.createElement('option');
                option.value = character[9]; // ID del personaje
                option.textContent = `${character[0]} - Nivel ${character[2]}`; // Nombre y nivel
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar personajes para el party:', error));
}

// Función para crear un party
document.querySelector('#create-party-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const partyName = document.querySelector('#party-name').value;
    const selectedCharacters = Array.from(document.querySelector('#party-members').selectedOptions).map(option => option.value);

    fetch('/api/add_party', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ party_name: partyName, character_ids: selectedCharacters })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Party creado exitosamente!');
            location.reload();
        }
    })
    .catch(error => console.error('Error al crear el party:', error));
});

// Función para cargar y mostrar los parties
function loadParties() {
    fetch('/api/get_parties')
    .then(response => response.json())
    .then(data => {
        const partiesContainer = document.querySelector('#parties-container');
        partiesContainer.innerHTML = ''; // Limpiar contenido previo

        data.forEach(party => {
            const partyBox = document.createElement('div');
            partyBox.classList.add('party-box');
            partyBox.innerHTML = `
                <h3>${party.party_name}</h3>
                <ul>
                    ${party.members.map(member => `<li>${member.name} (Nivel ${member.level})</li>`).join('')}
                </ul>
                <button onclick="deleteParty(${party.id})">Eliminar Party</button>
            `;
            partiesContainer.appendChild(partyBox);
        });
    });
}

// Función para eliminar un party
function deleteParty(partyId) {
    fetch(`/api/delete_party/${partyId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            loadParties(); // Recargar la lista de parties después de eliminar
        }
    })
    .catch(error => console.error('Error al eliminar party:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal-button');
    const closeModalButton = document.getElementById('close-modal-button');

    // Abrir el modal al hacer clic en el botón "Agregar Personaje"
    openModalButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Cerrar el modal al hacer clic en la "X"
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal al hacer clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Función para agregar un personaje
document.querySelector('#add-character-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Personaje agregado exitosamente!');
            loadCharacters(); // Recargar la lista de personajes después de agregar
        }
    })
    .catch(error => console.error('Error al agregar personaje:', error));
});


// Funcion para editar los personajes
function editCharacter(characterId) {
    fetch(`/api/get_character/${characterId}`)
        .then(response => response.json())
        .then(character => {
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

            // Mostrar el modal para editar
            modal.style.display = 'flex';

            // Cambiar el comportamiento del formulario para actualizar el personaje
            document.querySelector('#add-character-form').onsubmit = function(event) {
                event.preventDefault();
                updateCharacter(characterId);
            };
        })
        .catch(error => console.error('Error al obtener datos del personaje:', error));
}

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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Personaje actualizado correctamente.');
            loadCharacters(); // Recargar la lista de personajes después de actualizar
            modal.style.display = 'none'; // Cerrar el modal
        }
    })
    .catch(error => console.error('Error al actualizar personaje:', error));
}

// Funcion para eliminar personaje
function deleteCharacter(characterId) {
    fetch(`/api/delete_character/${characterId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Personaje eliminado correctamente.');
            loadCharacters(); // Recargar la lista de personajes después de eliminar
        }
    })
    .catch(error => console.error('Error al eliminar personaje:', error));
}

