# Node Template Project

Use this template project to create your own Node.js application!


## Features

Project contains both backend and frontend code and tools (you can easily separate them if you want).


### Principal ideas

One of the major goals of this framework is to separate code as much as possible
into small individual, pluggable modules. Each feature should be optional.

Also, we've developed it to be very extensible. The core of the framework is pretty
minimalistic and code is organized in a simple and a straightforward fashion. It will
give you the required basic organisation, but will not stand in your way.


### Backend

Backend is a REST server implemented via Restify, which API is very similar to Express.

- single entry point via app.js
- supports different execution environments (e.g. `development`, `production` etc), you can create your own
- all interfaces are promise-based (we are using Bluebird)
- centralized logging is implemented via bunyan, every request has it's own logging branch
- default HTTP errors are provided out of the box by restify, additional errors could be added
- routes are configured by a separate file, each controller action is stored in it's own node module
- often used controller code could be extracted into a so-called middleware,
  each controller action could has it's own set of configured middleware
- special validation middleware allows you to completely validate request data before your controller code is executed,
  all validation errors are automatically returned to the client, also, you can add your own validators
- database support is provided by Sequelize. You can define models, migrations and fixtures.
  PostgreSQL is used out of the box, but could be replaced by the data storage of your choice
- REPL CLI console is provided to execute your commands and
  run arbitrary code from the terminal in the context of your application,
  very useful to execute routines and debug your application


### Frontend

Frontend code is an Angular.js SPA application.

- bundles are compiled using gulp.js, each task is in it's own module
- styles are processed via PostCSS
- scripts are in CommonJS format and are bundled using webpack
- watches and LiveReload are provided for interactive development


### Deployment

Deployment is implemented with Flightplan and configured in `package.json`.


## How to start

### Install Node.js

Use the [following script](https://github.com/slavafomin/workstation-provision/blob/master/scripts/install-nodejs.sh)
to install latest version on Node.js.


### Install project dependencies

- `npm i -g flightplan bunyan sequelize sequelize-cli pg`
- `npm i`


### Setup PostgreSQL

- Run `sudo apt-get install -y postgresql` to install PostgreSQL

- Run `sudo -u postgres createuser -P example` and enter password `example` two times to create the role

- Run `sudo -u postgres createdb -O example example` to create the database

- Run `sudo -u postgres psql -c "ALTER ROLE postgres PASSWORD 'postgres'"`


### Run migrations

`sequelize db:migrate`


### Setup nginx and domain names

- `sudo apt-get install nginx -y`

- `cd /etc/nginx/sites-enabled/`

- `sudo rm ./default`

- `sudo nano ../sites-available/example.local.conf`

Paste the following content:

```
server {
    listen 80;

    server_name example.local;

    server_tokens off;

    # Adjust the path according to your filesystem
    root /home/username/example/.public;

    # Handling all static files
    location ~ "\.\w{3,4}$" {}

    # All other cases, i.e. application routes
    location / {
        try_files $uri /application.html =404;
    }

    # Passing API requests to Node.js application
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_buffering off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

- `sudo ln -s ../sites-available/example.local.conf`

- `sudo service nginx restart`

- `sudo nano /etc/hosts`

Add the following line: `127.0.0.1 example.local`


### Run the project

`node ./app.js | bunyan`
