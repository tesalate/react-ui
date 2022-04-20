# Before Starting myTesla with React-Scripts or Docker Compose
Run `yarn` in your terminal in the root of this directory

# Setting up myTesla to run locally with React-Scripts
## First, set up your .env file...
1. Export the BUILD_ENVIRONMENT stage to your local machine by running `export BUILD_ENVIRONMENT=local`
2. In the project directory, run `node generate_ui_env_vars.js` <br/> <br />
<b>NOTE: If you create any new environment variables for this app, they will need to be added to `generate_ui_env_vars.js` </b>

## Start myTesla:
You can run:
### `yarn start`

This runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

This builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

This command simply builds the files, to run the built files, run with the following commands <br />
  `yarn global add serve`<br />
  `serve -s build`

# Running myTesla with Docker Compose
There are multiple services in docker-compose.yml<br />
`myTesla`       -> Production build for myTesla. This will build CO with production environment variables s defined in generate_ui_env_vars.js <br />
`myTesla-uat`   -> UAT build for myTesla. This will build CO with UAT environment variables  defined in generate_ui_env_vars.js<br />
`myTesla-local` -> Local docker build for when you are developing locally. This will build CO with the local environment variables defined in generate_ui_env_vars.js<br />
`myTesla-pr` -> This docker build is used for running our test suites. This will build CO with the pr environment variables defined in generate_ui_env_vars.js<br />
`cypress` -> This services pulls the Cypress image from docker

## To Start/Build a container
Run `docker-compose up --build myTesla`.<br/>
This will build and start a new container for myTesla. This container is exposed on port 80 so navigate to http://localhost:80 to view the app.
To start the app with uat env vars, swap our `myTesla` with `myTesla-uat`


## Running Cypress with Docker Compose
Run `docker-compose up --build cypress`.<br/>
The Cypress service defined in docker-compose.yml has a myTesla-pr dependency. So running the command above with build/start the myTesla-pr container then build/start the Cypress container. From there, Cypress will run all of the tests.

## Stopping Docker-compose
Run `docker-compose down`<br/>
This will stop all docker containers started by docker-compose.
<hr/>
