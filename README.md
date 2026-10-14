# Isovia React Client

React 18 single-page client built with Create React App 5. The PHP/CodeIgniter API is a separate project at `../../fms_api-main/fms_api-main`.

## Local Setup

Requirements: Node.js and npm. Install the exact dependency versions from the lockfile:

```sh
npm ci
```

Configure the API origin with `REACT_APP_API_URL` in an untracked local `.env` file. The current fallback in `src/config.js` points to the configured Isovia API and should not be used as a substitute for an approved staging environment.

```env
REACT_APP_API_URL=http://localhost:8080/
```

The example origin above is illustrative; configure it to match the local or staging API base path. Some legacy screens still use direct absolute API URLs, so changing this value alone does not redirect every request.

## Commands

```sh
npm start
npm test -- --watchAll=false
npm run build
```

The current test suite contains only the Create React App starter test and does not cover Isovia workflows.

## API And Database

The frontend does not provision the MySQL database. No verified FMS schema dump, migration sequence, or sanitized fixture was found with this client. Use the backend owner's approved local/staging setup instructions; do not import the unrelated `restaurant.sql` file.

The router currently uses the site root as its base path. Deploying under a subpath requires coordinated React router, static-asset, and PHP API configuration changes.

## External Services

Some pages require provider configuration such as Google Maps, Samsara/Gomotive, OCR, or routing services. Use sandbox credentials and approved test data; never add credentials to this repository or upload production records to tests.