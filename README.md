# CRUD Employee Management System (HTML, CSS, JS)

* Employee Management System client app with CRUD function using HTML5, Tailwind CSS, and JavaScript only.
* JSON-server implemented for backend mock

## Features

* User-friendly interface
* Entry selection to manage employee records efficiently
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
5. Run `npm run build` to build client.
6. Run `npm run preview` to preview built client, do not close terminal.
7. Open another terminal and run `npm start` to start server, do not close terminal.
8. Open `http://localhost:4173` onto your browser.
9. You're good to go!

## Screenshots

![pic](screenshots/screenshot-1.png)
![pic](screenshots/screenshot-2.png)

## [WIP] Next Features

### UI related

1. Add responsiveness by showing fewer data
2. Compensate fewer data shown by adding detail button
3. Loading animation

### CRUD related

1. Function to update data
2. Sanitise input
