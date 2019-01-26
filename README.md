# Running Service

Running natively:

`THERMOSTAT_IP=192.168.1.100 POLLING_DELAY=600000 npm start`

Docker Compose:

```
version: '2'
services:
 radiothermostat-watcher:
   image: joshrivers/radiothermostat-guard
   restart: always
   environment:
     - THERMOSTAT_IP=192.168.1.100
```

# Execute Unit Tests

Single run:

`npm run test`
`npm run coverage`

Watch while developing:

`npm run watchtest`