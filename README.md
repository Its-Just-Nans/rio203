# rio203

A student project to manage a parking using IoT devices.

This repo is linked to:

- <https://github.com/Its-Just-Nans/rio203> (this repo) - web server
- <https://github.com/comeyrd/rio203-image-detection> - License plate detection (on Raspberry Pi)
- <https://github.com/katheleligaf/rio203-sensors> - Sensors (ESP32, Rasperry Pico W)
- <https://github.com/comeyrd/rio203-diagrams> - Diagrams for the final report
- <https://github.com/Its-Just-Nans/rio203-report> - Final report

<details>

<summary>Details on this repo </summary>

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
- API is Cross Origin: "*" (not safe)

</details>
