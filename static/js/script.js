document.addEventListener('DOMContentLoaded', function() {
    // Fetch para obtener los personajes de la base de datos cuando la página carga
    fetch('/get_characters')
    .then(response => response.json())  // Convertir la respuesta en formato JSON
    .then(data => {
        // Selecciona el cuerpo de la tabla donde se mostrarán los personajes
        const tableBody = document.querySelector('#characters-table tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        // Iterar sobre los personajes recibidos
        data.forEach(character => {
            const row = document.createElement('tr'); // Crear una nueva fila
            row.innerHTML = `
                <td>${character[0]}</td>  <!-- Nombre del personaje -->
                <td>${character[1]}</td>  <!-- Clase del personaje -->
                <td>${character[2]}</td>  <!-- Nivel actual del personaje -->
                <td>${character[3] ? 'Sí' : 'No'}</td>  <!-- Party Master (Sí/No) -->
                <td>${character[4] ? 'Sí' : 'No'}</td>  <!-- Mulo (Sí/No) -->
                <td><button class="delete-button" data-id="${character[5]}">Eliminar</button></td> <!-- Botón para eliminar el personaje -->
            `;
            tableBody.appendChild(row); // Añadir la fila a la tabla
        });
    })
    .catch(error => console.error('Error al cargar personajes:', error)); // Captura errores al obtener personajes

    // Manejador de eventos para el formulario de agregar personaje
    const form = document.querySelector('#add-character-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir la recarga de la página al enviar el formulario
        const formData = new FormData(form); // Obtener los datos del formulario
        const jsonData = {}; // Crear un objeto para almacenar los datos del formulario

        // Iterar sobre los datos del formulario y crear el objeto JSON
        formData.forEach((value, key) => {
            if (key === 'is_party_master' || key === 'is_mule') {
                jsonData[key] = form.hasAttribute(key); // Convertir checkbox en valores booleanos
            } else {
                jsonData[key] = value; // Almacenar el resto de los valores
            }
        });

        // Fetch para agregar un nuevo personaje a la base de datos
        fetch('/add_character', {
            method: 'POST', // Método POST para enviar los datos
            headers: {
                'Content-Type': 'application/json' // Los datos se envían como JSON
            },
            body: JSON.stringify(jsonData) // Convertir los datos del formulario en JSON
        })
        .then(response => response.json())  // Convertir la respuesta en formato JSON
        .then(data => {
            if (data.status === 'success') {
                location.reload(); // Recargar la página si el personaje se agregó con éxito
            }
        })
        .catch(error => console.error('Error al agregar personaje:', error)); // Captura errores al agregar personaje
    });

    // Manejador de eventos para el botón de eliminar personajes
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-button')) {
            const characterId = event.target.getAttribute('data-id'); // Obtener el ID del personaje
            fetch(`/delete_character/${characterId}`, {
                method: 'DELETE' // Método DELETE para eliminar el personaje
            })
            .then(response => response.json())  // Convertir la respuesta en formato JSON
            .then(data => {
                if (data.status === 'success') {
                    location.reload(); // Recargar la página si el personaje se eliminó con éxito
                }
            })
            .catch(error => console.error('Error al eliminar personaje:', error)); // Captura errores al eliminar personaje
        }
    });

    // Función para cargar y mostrar los parties
    function loadParties() {
        fetch('/get_parties')  // Fetch para obtener los parties de la base de datos
        .then(response => response.json())  // Convertir la respuesta en formato JSON
        .then(data => {
            const partiesContainer = document.querySelector('#parties-container'); // Contenedor de los parties
            partiesContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los parties

            // Iterar sobre los parties recibidos
            data.forEach(party => {
                const partyBox = document.createElement('div'); // Crear un nuevo div para cada party
                partyBox.classList.add('party-box'); // Añadir una clase CSS para el estilo
                partyBox.innerHTML = `
                    <h3>Party: ${party.name}</h3>  <!-- Nombre del party -->
                    <p>Miembros: ${party.members.join(', ')}</p>  <!-- Lista de miembros -->
                    <p>Nivel: ${party.level}</p>  <!-- Nivel del party -->
                `;
                partiesContainer.appendChild(partyBox); // Añadir el party al contenedor
            });
        })
        .catch(error => console.error('Error al cargar parties:', error)); // Captura errores al obtener parties
    }

    // Cargar los parties cuando la página se cargue
    loadParties();
});

