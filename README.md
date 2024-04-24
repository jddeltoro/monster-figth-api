# Monster Battle Game API

This is an API built to support a game where monsters can fight. It's built using Express, Objection.js, Knex, and SQLite.

## Description

This API provides endpoints for managing monsters and battles in the game.

## Installation

Clone the repository and navigate into the directory:

```bash
git clone <repository>
cd <repository>
```

## Install the dependencies:
```bash
npm install
```

## API Endpoints
Monsters
GET /monsters: Get all monsters
POST /monsters: Create a new monster
GET /monsters/:id: Get a specific monster
PUT /monsters/:id: Update a specific monster
DELETE /monsters/:id: Delete a specific monster
Battles
GET /battle: Get all battles
POST /battle: Start a new battle
GET /battle/:id: Get a specific battle
PUT /battle/:id: Update a specific battle
DELETE /battle/:id: End a specific battle


## Tests
```
npm run test
```


