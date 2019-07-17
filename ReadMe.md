# Flourish Challenge

- Navigate to project root - `cd [repo_root]`
- Start MySQL Container - `npm run db`
- Confirm DB Server & Database - `npm run dbTest`
- Build Shared Lib - `npm run lib`
- Migrate & Seed MySQL - `npm run etl`
- Start API - `npm run api`


# Done

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
- 

# Todo

- strain business search strains
- create data access / orm OR use controller to map entity to model? (expensive or cheap)
- repurpose business to use orm ?
- create routes / business for get
- create routes / business for insert
- create routes / business for update
- add query param middleware?
- add params to get for searching / update get business

- tests project ?
- nodemon? / pm2? for multithreading
- in-code documentation comments
