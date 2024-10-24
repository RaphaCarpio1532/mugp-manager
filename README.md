# MUGP Characters Management Application

## Description
This is a web application built with Flask that allows you to manage characters and parties for the MUGP game. Users can add new characters, create parties with those characters, and view the stored information. The user interface is developed with HTML, CSS, and JavaScript to provide an interactive and appealing experience.

## Technologies Used
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **Styling**: Custom CSS (using the 'Brooklyn' font)

## Features
- Add new characters, including ID, level, email, and other attributes.
- Create and manage parties with the registered characters.
- View a list of existing characters and parties.

## Prerequisites
To run the application, you will need:
- Python 3.8+
- Virtualenv (optional but recommended)

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/RaphaCarpio1532/mugp-manager.git
   ```
2. Navigate to the project directory:
   ```sh
   cd MUGPPROJECT
   ```
3. Create a virtual environment (optional):
   ```sh
   python -m venv venv
   ```
   Activate the virtual environment:
   - On Windows:
     ```sh
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```sh
     source venv/bin/activate
     ```
4. Install the dependencies:
   ```sh
   pip install -r requirements.txt
   ```
5. Set up the database by running the `schema.sql` script to create the necessary tables in the `database.db` file.
6. Run the application:
   ```sh
   flask run
   ```
7. Open your browser and go to `http://127.0.0.1:5000/` to see the application in action.

## Main Endpoints
- `/get_characters`: Retrieves the list of characters stored in the database.
- `/add_party`: Creates a new party with the selected characters.
- `/get_parties`: Retrieves the list of existing parties.
- `/delete_party/<party_id>`: Deletes a party by its ID.

## Known Issues
- Some styles in the `styles.css` file are incomplete.
- Some endpoints were missing but have been added in the current version.
- Ensure that the paths to static files are correctly set up.

## Contributions
If you want to contribute, please open a pull request with any improvements or fixes you deem necessary.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
