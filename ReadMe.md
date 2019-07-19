# Flourish Challenge

# Project folders

- Includes `db` folder
- Includes `lib` folder
- Includes `etl` folder
- Includes `api` folder

# Dependencies

- [Docker Installed && Daemon is Started(I have version Version 18.06.1-ce-mac73)]
- [NodeJs Installed w/ NPM (LTS or greater)]
- `npm install -g typescript`
- `npm install -g pm2`
- [Postman Installed for Testing]

# Run

- Navigate to project root - `cd [repo_root]`
- Start MySQL Container - `npm run dbStart` (Stop with `npm run dbStop`)
- Confirm DB Server & Database - `npm run dbList`
- Build Shared Lib - `npm run lib`
- Migrate & Seed MySQL - `npm run etl`
- Confirm DB Data via MySQL - `npm run dbStrains`
- Start API - `npm run apiStart` (Stop with `npm run apiStop`)
- Test w/ Postman Collection - Find the file `Flourish-Challenge.postman_collection.json` 
- Create documentation - ``


# Tasks Done

- set up docker db image / container
- create api
- use typscript
- query db from api
- db server setup sql
- environment configuration via json file
- run db migration on startup
- run setup sql on initial run
- script to kick off migration & data etl process
- use shared typescript lib
- improve project structure / scripting
- create test route and request logging middleware
- create db storage schema & run
- delegate migration list to config and allow multiple migration files
- download / install mysql workbench
- create etl data insert
- create strain business
- refactor etl to use business
- strain business - create with and without identity insert
- allow config to associate migrations to a specific db
- allow config of more than one db
- strain business get all strains
- strain business delete strain by id
- strain business get all strain by id/s
- strain business get all effect types
- strain business get all races
- strain route
- base response and strain responses
- base error and other errors
- return 404 when no route is matched
- data repository / access layer
- mapping of strain dto to entity and back
- lite and detail strain models
- repurpose etl to insert with dto instead of entity
- create route method / business for get all strains
- create route method / business for get strain by id
- return error when strain by id not found in db
- return error when strain by id is invalid
- build db "context" with db connector pattern
- use db transactions and connection pool in repository
- nodemon? / pm2? for multithreading
- mysql bulk inserts
- Postman collection started
- route method for create
- unique index on strain name
- route method / business / repo / postman for search
- route method / business / repo for update detail
- 

# Tasks Todo

- in-code documentation comments - jsdoc
- create / update validations

- use redis for caching static data like effect types / races
- move migrations to lib
