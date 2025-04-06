# CRUD Employee Management System (HTML, CSS, JS)

* Employee Management System client app with CRUD function using HTML5, Tailwind CSS, and JavaScript only.
* JSON-server implemented for backend mock

## Features

* User-friendly interface
* Entry selection to manage employee records efficiently
* Sort and order data to improve records readability
* Filter employees by ID, name, email or role to find employees quickly
* Pagination for easy navigation through employee records
* Modal display for easy access of adding employee
* Quick actions button to delete employee
* Upload picture of employees and store it to json-server (as base64)

## Getting ready

1. Make sure your device have already installed Node.js and a browser.
2. Clone this repository via Git or download zip.
3. Rename `db.json.example` to `db.json`.
4. Open a terminal in the repo folder and run `npm i` to install modules, wait until it's done.
5. Run `npm start` to start server, do not close terminal.
6. Open another terminal and run `npm run build` and immediately after, run `npm run preview` to start client, do not close terminal.
7. Open `http://localhost:4173` onto your browser.

## Screenshots

![pic](screenshots/screenshot-1.png)
![pic](screenshots/screenshot-2.png)
![pic](screenshots/screenshot-3.png)

## [WIP] Next Features

### UI related

1. Add responsive UI
2. Add detail button on each employee
3. Loading and error animation

### CRUD related

1. Update employee
2. Sanitise input
