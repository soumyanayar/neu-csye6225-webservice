# webservice

## Assignment 1
This assignment solution is the implementation of a web application using a technology stack that meets Cloud-Native Web Application Requirements. It uses Express (a Node.js web application framework) to build the web application.

### How to install, run and test the application?
#### To install

```shell
npm install
```

#### To start the application
```shell
npm start
```

#### To run all the unit tests
```
npm test
```

The application uses `express module's router` to create the routes and uses `http` module to create the http server (exposed at port 3000). The application implements the api specified in the [Swagger Doc](https://app.swaggerhub.com/apis-docs/spring2022-csye6225/app/a01). The application uses `jest` and `supertest` modules to run unit tests to validate the endpoints and few other scenarios. The application returns proper http status codes based as per [Http Status Codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

A proper `.gitignore` is created for ignoring node & vscode related build and config files which are not necessary to be checked in to the version control.

When we run this application using the `npm start` command, it starts the server locally, available at `http://localhost:3000` which cab be tested via postman.

An automated workflow is created via github actions to run the unit tests via the file `node.js.yml` which has jobs to create node js environment in ubuntu os. Then it installs the node application and runs all the tests. This action is triggered whenever a pull request or push to main branch is done.

Also, branch protection is added in the upstream repo where unless all the workflows run successfully, it doesn't allow the Pull Request to merge to the main branch.