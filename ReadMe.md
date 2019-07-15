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

# Todo

- create routes / business for get
- create routes / business for insert
- create routes / business for update
- add query param middleware?
- add params to get for searching / update get business

- tests project ?
- make migration command read all files in migration folder, in order
- environment configuration via json file
- nodemon? / pm2? for multithreading
- in-code documentation
