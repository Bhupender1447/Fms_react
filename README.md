# Isovia React client

React 18 application using Create React App 5 and React Router 6. Source lives in `src`, public browser assets in `public`, and current build output in `build`.

Read the workspace [developer guide](../docs/developer/DEVELOPER_GUIDE.md) for local configuration, API relationships, feature locations and known blockers. The PHP backend is in `../fms_api`. React tests and their runner are in `../tests/frontend`.

From the workspace root, use `scripts/dev.ps1 Frontend` for the supported localhost setup. From this directory, standard commands remain available.

```powershell
npm.cmd ci
npm.cmd start
npm.cmd test -- --watchAll=false --runInBand
npm.cmd run build
```

`src/config.js` resolves the local API during development. Configure `REACT_APP_API_URL` for the intended environment, then restart or rebuild. Some legacy screens still embed hosted API URLs.

[Test commands](../tests/README.md) · [Route map](../docs/developer/ROUTES.md) · [Workspace guide](../README.md)