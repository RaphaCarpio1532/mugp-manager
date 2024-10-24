document.addEventListener('DOMContentLoaded', function() {
    loadCharacters(); // Cargar los personajes al cargar la página
    loadParties(); // Cargar los parties al cargar la página
});

// Función para cargar y mostrar los personajes
function loadCharacters() {
    fetch('/get_characters')
        .then(response => response.json())
        .then(data => {
            const charactersTable = document.querySelector('#characters-table tbody');
            charactersTable.innerHTML = ''; // Limpiar contenido previo

            data.forEach(character => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${character[0]}</td>
                    <td>${character[1]}</td>
                    <td>${character[2]}</td>
                    <td>${character[3] ? 'Sí' : 'No'}</td>
                    <td>${character[4] ? 'Sí' : 'No'}</td>
                `;
                charactersTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar personajes:', error));
}

// Función para mostrar el formulario de creación de party
function showCreatePartyForm() {
    const partyFormContainer = document.querySelector('#party-form-container');
    partyFormContainer.style.display = 'block'; // Mostrar el formulario
    
    // Obtener personajes y llenar el select
    fetch('/get_characters')
        .then(response => response.json())
        .then(data => {
            const select = document.querySelector('#party-members');
            select.innerHTML = ''; // Limpiar opciones previas

            data.forEach(character => {
                const option = document.createElement('option');
                option.value = character[5]; // ID del personaje
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

    fetch('/add_party', {
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
    fetch('/get_parties')
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
    fetch(`/delete_party/${partyId}`, {
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
