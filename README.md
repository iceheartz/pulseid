## Setup

```sh
$ git clone https://github.com/iceheartz/pulseid.git
$ cd pulseid
$ npm install
```

### Generating the unit test

```sh
$ npm run test
```

## Docker

To start a fully dockerised app,

```sh
$ docker-compose up
```

## Accessing the API

Locate the API with the following endpoints

```sh
Create invite Token
http://localhost:8888/api/token POST Method

Validate invite Token
http://localhost:8888/api/token GET Method

Disable invite Token
http://localhost:8888/api/token PUT Method

Get all invite Token
http://localhost:8888/api/tokens GET Method

```