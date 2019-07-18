# Flourish Challenge

- Navigate to project root - `cd [repo_root]`
- Start MySQL Container - `npm run db`
- Confirm DB Server & Database - `npm run dbList`
- Build Shared Lib - `npm run lib`
- Migrate & Seed MySQL - `npm run etl`
- Confirm DB Data via MySQL - `npm run dbStrains`
- Start API - `npm run api`
- Create documentation - ``

# Test Fiddlers / Postmans 
(Note: DNE === Does Not Exist)

- Get All Strains - GET `http://localhost:8888/strain/all`
- Get Strain Detail - GET `http://localhost:8888/strain/1`
- Get Strain Detail When DNE - GET `http://localhost:8888/strain/detail/7`
- Delete Strain - DELETE `http://localhost:8888/strain/detail/1`
- Delete Strain When DNE - DELETE `http://localhost:8888/strain/detail/1`
- Create Strain - ``
- Update Strain - ``
- Update Strain When DNE - ``
- Search Strains By Single Property - ``
- Search Strains By Many Properties - ``
- Search Strains When No Results - ``

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
- use db transactions ? investigated and decided against for now (for time's sake)
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
- 

# Tasks Todo

- strain business search strains
- create route method for create
- create route method / business / repo for update
- create route method / business / repo for search
- Postman or the like
- nodemon? / pm2? for multithreading
- in-code documentation comments - jsdoc
