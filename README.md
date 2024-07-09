# Technical Test Frontend
* [Quick Start](#quick-start)
* [Running Tests](#running-tests)
* [Screenshots](#screenshots)

## Quick Start

  Install dependencies:

```console
$ npm install
```

  Create a `.env` file in the root of your project

```dosini
VITE_API_URL="http://<your_backend_host>"
VITE_API_PORT=<your_backend_port>
```

  Start the application:

```console
$ npm run dev -- --host
```

  View the website at: http://<your_frontend_host>:5173

### Running Tests

  Run the tests using Jest:

```console
$ npm run test
```

### Screenshots

  List with pagination, sorting
  <p>
    <img src='/screenshots/02_list_pagination.png' width='48%' alt='List pagination'>
    <img src='/screenshots/03_list_sorting.png' width='48%' alt='List sorting'>
  </p>

  Add with validation
  <p>
    <img src='/screenshots/04_add.png' width='48%' alt="Add with validation">
    <img src='/screenshots/02_list_pagination.png' width='48%' alt='Add success'>
  </p>
  
  Edit with validation
  <p>
    <img src='/screenshots/06_edit.png' width='48%' alt="Edit with validation">
    <img src='/screenshots/07_edit_success.png' width='48%' alt='Edit success'>
  </p>
  
  Delete
  <p>
    <img src='/screenshots/08_delete.png' width='48%' alt="Delete">
    <img src='/screenshots/09_delete_success.png' width='48%' alt='Delete success'>
  </p>
