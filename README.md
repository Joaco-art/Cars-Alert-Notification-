# Cars Alert Notification

Node.js web application designed for querying, searching, and displaying vehicle listings and information, featuring filtering, pagination, and HTML views.

> **Note:** Check the exact scripts in `package.json`, connection settings in `src/db.js`, and routes in `src/router.js` according to the current state of the codebase.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Installation](#local-installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Views and Web Navigation:** HTML pages and partials for the home page (`index.html`), landing section (`hero.html`), search (`search.html`), featured listings (`anunciosDestacados.html`), vehicle details (`carInfo.html`), frequently asked questions (`faq.html`), error handling (`error.html`), header (`header.html`), and footer (`footer.html`).
- **Filtering and Pagination:** Result filtering and pagination logic implemented in `src/filtersAndPagination.js`.
- **Routing and Server:** Main setup and route management handled through `src/app.js` and `src/router.js`.
- **Data Management:** Centralized data access and configuration in `src/db.js`.
- **Scripts and Styles:** Additional behavior in `src/scripts.js` and stylesheets in `public/css/main.css`.

## Project Structure

```text
Cars-Alert-Notification-/
├── public/
│   └── css/
│       └── main.css               # Main application stylesheets
├── src/
│   ├── app.js                     # Main application initialization and configuration
│   ├── db.js                      # Database connection and data management
│   ├── filtersAndPagination.js    # Listing filters and pagination logic
│   ├── router.js                  # Application route definitions
│   └── scripts.js                 # Auxiliary application scripts
├── views/
│   ├── anunciosDestacados.html    # Featured listings view
│   ├── carInfo.html               # Vehicle detail view
│   ├── error.html                 # Error view
│   ├── faq.html                   # Frequently asked questions view
│   ├── footer.html                # Footer partial
│   ├── header.html                # Header partial
│   ├── hero.html                  # Hero section partial
│   ├── index.html                 # Home page
│   └── search.html                # Search view
├── .gitignore                     # Files ignored by Git
├── package-lock.json              # Exact dependency lockfile
└── package.json                   # Metadata, dependencies, and npm scripts
