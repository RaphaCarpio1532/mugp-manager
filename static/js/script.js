document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_characters')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#characters-table tbody');
        tableBody.innerHTML = '';
        data.forEach(character => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${character[0]}</td>
                <td>${character[1]}</td>
                <td>${character[2]}</td>
                <td>${character[3] ? 'Sí' : 'No'}</td>
                <td>${character[4] ? 'Sí' : 'No'}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error al cargar personajes:', error)); // Mueve el catch aquí

    const form = document.querySelector('#add-character-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => {
            if (key === 'is_party_master' || key === 'is_mule') {
                jsonData[key] = value === 'on';
            } else {
                jsonData[key] = value;
            }
        });

        fetch('/add_character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

