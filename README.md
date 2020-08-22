# maumau

Epic maumau game

## Development

### Getting started

- Install all dependencies via `yarn install`
- Build the client via `cd packages/maumau-client && yarn build`
- Start the server via `cd packages/maumau-server && yarn dev`
- Browse to `http://localhost:8080`

## Deployment

### Build Docker container locally

To build the docker container run the build command to create the docker image.

```
docker build .
```

Once the command end, the docker container can be run with it's id:

```
docker run -p 80:8080 ${id}
```
