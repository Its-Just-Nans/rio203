# rio203

A student project to manage a parking using IoT devices.

## Development

```sh
npm run dev
# will run the server on 3000 and the frontend on 8080
```

## Deployement

```sh
npm run deploy
# you need a server.service on the production server
# this will connect to the server, build pages and restart the service

# can be useful to debug
# journalctl --unit=server.service -f
# systemctl restart server.service
```

## Notes on the project

- password is stored in clear text
- token used for auth are not safe, signed JWT should be used
