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





## Assignment 2
This assignment solution includes the followings technology and commands:

1. A Token-based web authentication called `basic authentication` is used at the authenticating end point, for the user to access the page
   
2. `password hashing` technology is used to hash the password and save in the database
   
3. `salt` is used to retrieve the passwords from hashed passwords, from the database when a user is trying to login/authenticate 
   
4. `npm install --save bcrypt` is used to install the dependencies for the above said feature to be functional
   
5. `MySQL` is used as the relational database and `Sequilize` is used as the ORM(object relational mapping) tool, this tool to map and communicate between objects and relational database systems. This provides good flexibility in connecting, storing and accessing the data

6. `npm install --save sequilize`  and `npm install --save mysql2 ` are the commands used to install and save the dependencies related to sequilize and mySQL



#### Work Flow

1. Every time when a user is `create`d, the valid username, hashed password, first_name, last_names, createdAt(Time and Date) and updatedAt(Time and Date) are saved in db.

2. For every `GET` method the user has to provide the username and password as an authentication. The hashed password saved in the db will be then decrypted and `compared` with the `password(Entered by the user)`. If that matches, then login is `successful` otherwise returns an error `unauthorized user`

3. To `Update` any fields in the user information, first the login should be legit. What I mean is, the user details should be present in the db, Later if the user wants change any fields ( `password`, `first_name` and `last _name`  fields only) can be allowed.



## Assignment 4
#### Work Flow : There are several stages involved in this assignment

### Stage 1 : Packer file to create AMI in the AWS Console
1. Using the packer file format, aws-ami.pkr.hcl is written, To add show the same AMI in demo account `ami_users` properties also used in source of the file.
2. We need to install MySQL, node.js, unzip in the Vm we are creating, therefore we need to include the commands to do the same in our packer as well. scripts (.sh) file has all the commands those will install the required applications and packages.
3. Any special variables can be saved in the `packervariables.json` file
4. To format the file use `packer fmt .` command.
5. To validate the packer use ` packer validate . ` 
6. To run the packer file use `packer build aws-ami.pkr.hcl`
7. To run thr packer with variable parse the argument `packer build -var-file='/Users/soumyanayar/NEU/Spring 2022/Cloud Computing/webservice/packervariables.json' aws-ami.pkr.hcl`

### Stage 2: Github actions 
1. To automate the AMI building in the AWS console enable the github actions when pull request merges with main branch

### Stage 3: When the build completes in the github actions
1. Go to the AWS EC2 console and check for AMI(Private) and copy the `ami-id` 

### Stage 4: CloudFormation
1. Go to `infrastructure` repo and paste the `ami-id` in the AMI parameter 
2. And deploy the cloudformation using `aws cloudformation deploy --profile dev --stack-name final1 --region us-west-2 --template-file ./csye6225-infra.yml`
   
### Stage 5: Web application
1. Go the instance that runs with the `stack-name` and copy the `public_ip_address` 
2. Now got the `postman` app and pass `public_ip_address:3000/healthz` and other end points to check whether the web application is running

Sample Change
