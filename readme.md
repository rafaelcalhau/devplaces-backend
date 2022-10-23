[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<div align="center">
  <h1>devplaces-backend</h1>
  <p>This is the backend application for DevPlaces, a small project inspired in Rocketseat OmniStack Week 9</p>
</div>

## Get Started

1. Clone the project

```bash
  git clone https://github.com/rafaelcalhau/devplaces-backend.git
```

2. Navigate into the project folder

```bash
  cd devplaces-backend
```

3. Install all dependencies using the NPM or YARN

```bash
  npm install # or yarn
```

4. Rename the file .env.example to .env and edit it with your own data.

```bash
  cp .env.example .env
```

## Usage

**🚨 NOTICE: before running the project, make sure your .env file
is already created and have all necessary values. This application
uses MongoDB, and if you don't want to run it on your local
environment, you can create your database totally free on
[MongoDB Atlas](https://www.mongodb.com).**

---

Run for development:

```bash
  npm run dev # or yarn dev
```

## Public Routes

- Sign In:

  <code>POST /api/authenticate</code>

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- Create User

  <code>POST /api/users</code>

  <strong>body:</strong>

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

## Private Routes

<strong>Required:</strong> Add your user id into the request headers

```json
{
  "userid": string;
}
```

### SPOTS

- Create a spot

  <code>POST /spots</code>

  <strong>body:</strong>

  ```json
  {
    "company": "string",
    "price": 15.0,
    "technologies": "php,javascript,react"
  }
  ```

  _Accepts an file upload._

- Update a spot

  <code>PUT /spots/:id</code>

  <strong>body:</strong>

  ```json
  {
    "company": "string",
    "price": 15.0,
    "technologies": "php,javascript,react"
  }
  ```

  _Accepts an file upload._

- Delete a spot

  <code>DELETE /spots/:id</code>

- List all spots

  <code>GET /spots</code>

### BOOKINGS

- Book a spot

  <code>POST /spots/:spot_id/bookings</code>

  <strong>body:</strong>

  ```json
  {
    "date": "string"
  }
  ```

- Update a booking

  <code>PATCH /spots/:spot_id/bookings/:booking_id</code>

  <strong>body:</strong>

  ```json
  {
    "approved": "boolean"
  }
  ```

- Delete a booking

  <code>DELETE /spots/:spot_id/bookings/:booking_id</code>

- List all bookings from a spot

  <code>GET /spots/:spot_id/bookings</code>

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
