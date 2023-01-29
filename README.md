# Cubesat Server v2
This repository is meant to be a the server used for groudstation dashboard.

## Instructions
- Clone repository.
- Run `pnpm install` to install dependancies.
- Create .env.dev file with fields specified in env.ts service.
  - PORT=5000
  - HOST_NAME=127.0.0.1
  - FRONTEND_ORIGIN=http://localhost:5173
  - DATABASE_URL=[Contact Team Lead for this]
- Run scripts below as needed.

## Scripts
There are scripts for running the build process, starting the server, and running tests. The main ones are provided below.
- `clean:dev` and `clean:prod` empty the `dev` and `prod` directories respectively.
- `tsc:dev` and `tsc:prod` run the Typescript compiler using the `tsconfig.json` and `tsconfig.prod.json`, respectively. Furthermore, the outputs of the two commands are the `dev` and `prod` folders, respectively. Prod does not have the test folder in it.
- `alias:dev` and `alias:prod` updates the path aliases in the build output to be correct.
- `build:prod` and `build:dev` run the Typescript compilation and alias correction at the same time.
- `start:prod` and `start:dev` starts the server with the appropriate environment.
- `prod` and `dev` runs the build step and starts the server
- Note that before running `dev` or `dev:watch`, run `db:pull:dev` as needed to make sure Prisma is synced with DB. `prod` calls this by default to make sure DB and server are in sync at deployment time.
- All options that have watch at the end run the same command but in watch mode.
- `test` runs the `vitest` tests. Note that it does not build, so `build:dev` should be called before running `test`.

## About Structure
- The `.env` and `.env.dev` are for production and development respectively
- Folders in the src directory can be imported from by using '@/[folder_name]' (ex. import {a_controller} from '@/controllers/someControllers.js')
- Imports of local Typescript files must have `js` or `cjs` endings due to NodeNext module resolution.
- Folder structure goes as follows in src
    - `controllers` are responsible for processing a request, composing services and utils to create a response, and sending the response. These files defines the API for each endpoint.
    - `middlewares` are used for performing actions on every reqeust that hits the app or route it is attached to. Examples are logging and checking auth status.
    - `models` define the shape of entities that are involved in the code.
    - `services` are responsible for interfacing with external data providers (ex. database), API's, or other data producing logic that a controller would need. Also, they take care of core logic for the backend.
    - `utils` are commonly used functions (key being that it is meant for convenience of the devs, not a core functionality of the dashboard).
    - `index.ts` is the main file that is ran when server starts
- Test is split into unit tests and integration tests.