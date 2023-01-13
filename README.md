# Express.js + TS Template
This repository is meant to be a template to be cloned for future projects for a standard Express.js and Typescript backend server.

## Instructions
- Create copy of repository.
- Run `npm i` to install dependancies.
- Follow Prisma documentation to setup for connection to a DB, if needed.
- Enjoy!

## Scripts
There are scripts for running the build process, starting the server, and running tests. The main ones are provided below.
- `tsc:dev` and `tsc:prod` run the Typescript compiler using the `tsconfig.json` and `tsconfig.prod.json`, respectively. Furthermore, the outputs of the two commands are the `dev` and `prod` folders, respectively. Prod does not have the test folder in it.
- `alias:dev` and `alias:prod` updates the path aliases in the build output to be correct.
- `build:prod` and `build:dev` run the Typescript compilation and alias correction at the same time.
- `start:prod` and `start:dev` starts the server with the appropriate environment.
- `prod` and `dev` runs the build step and starts the server
- All options that have watch at the end run the same command but in watch mode.
- `test` runs the `vitest` tests. Note that it does not build.

## About Structure
- The `.env` and `.env.dev` are for production and development respectively
- Folders in the src directory can be imported from by using '@/[folder_name]' (ex. import {a_controller} from '@/controllers/someControllers.js')
- Imports of local Typescript files must have `js` or `cjs` endings due to NodeNext module resolution.
- Folder structure goes as follows in src
    - `controllers` are responsible for processing a request, composing services and utils to create a response, and sending the response.
    - `middlewares` are used for performing actions on every reqeust that hits the app or route it is attached to.
    - `models` define the shape of entities that are involved in the code.
    - `routes` are responsible for associating a controller to a set sub route and request method.
    - `services` are responsible for interfacing with external data providers (ex. database), API's, or other data producing logic that a controller would need.
    - `utils` are commonly used functions.
    - `index.ts` is the main file that is ran when server starts
- Test is split into unit tests and integration tests.