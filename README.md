# Cubesat Server v2

This repository is meant to be a the server used for groudstation dashboard.

## Instructions

- Clone repository.
- Run `pnpm install` to install dependancies.
- Get .env file from team lead
- Make sure to create a localhost alias for the `SERVER_URL` if needed ([Instructions](https://docs.google.com/document/d/1oUcxWJxfT3Z9tPbsf9MT_YQPwSZO7H9nopeJweSMaZ0/edit))
- Run `pnpm run db` to setup Prisma (also run this script whenever you pull main).
- Run scripts below as needed.

## Scripts

There are scripts for running the build process, starting the server, and running tests. The main ones are provided below.

- `clean:dev` and `clean:prod` empty the `dev` and `prod` directories respectively. `clean` clears both.
- `tsc:dev` and `tsc:prod` run the Typescript compiler using the `tsconfig.json` and `tsconfig.prod.json`, respectively. Furthermore, the outputs of the two commands are the `dev` and `prod` folders, respectively. Prod does not have test files or the prisma seed file.
- `alias:dev` and `alias:prod` updates the path aliases in the build output to be correct.
- `build:prod` and `build:dev` run the Typescript compilation and alias correction at the same time.
- `start:prod` and `start:dev` starts the server with the appropriate environment.
- `prod` and `dev` runs the build step and starts the server
- All options that have watch at the end run the same command but in watch mode (wil rerun tasks if files change).
- `test` runs the `vitest` tests. Note that it does not build, so `build:dev` should be called before running `test`.
- `db:pull` updates the current database schema using `DATABASE_URL` in .env
- `db:generate` creates the TS lib for the database models (basically sets up Prisma for use in the codebase)
- `db` runs both pull and generate
- `db:seed` seed runs all seeding scripts to automate mock data creation and storage in dev db branch.
- `db:seed:log` creates and replaces logs in dev db branch.
- Note: To add/remove/update users from user table, run `npx prisma studio`. It will start a web client where you can modify user data (and log data as well but managing log data manually is a pain).

## About Structure

- The `.env` file holds enviroment variables. Most team memebers only need the development one.
- Folders in the src directory can be imported from by using '@/[folder_name]' (ex. import {a_controller} from '@/controllers/someControllers.js')
- Imports of local Typescript files must have `js` or `cjs` endings due to NodeNext module resolution.
- Folder structure goes as follows in src
  - `controllers` are responsible for processing a request, composing services and utils to create a response, and sending the response. These files defines the API for each endpoint.
  - `middlewares` are used for performing actions on every reqeust that hits the app or route it is attached to. Examples are logging and checking auth status.
  - `models` define the shape of entities that are involved in the code.
  - `services` are responsible for interfacing with external data providers (ex. database), API's, or other data producing logic that a controller would need. Also, they take care of core logic for the backend.
  - `utils` are commonly used functions (key being that it is meant for convenience of the devs, not a core functionality of the dashboard).
  - `index.ts` is the main file that is ran when server starts.
- Testing is done using vitest (at the time of decision, it was the only testing lib that supported es6 imports and mocking).
