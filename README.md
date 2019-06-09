# Relief Map Example

Simple setup for a client/server for displaying relief points stored on a public Google spreadsheet. Also includes Procfile for Heroku deployment

## Features

- Server to read from public Google spreadsheet of relief points
- Client app (made with `create-react-app`) that displays the relief points on a map (using `mapbox-gl.js`)

## Todo

- [x] Pull data from spreadsheet using Google Spreadsheet API
- [x] Setup REST API
- [x] Display relief points using Mapbox in React app
- [ ] Extend REST API to CRUD (create, update, delete) relief points
- [ ] Submit new relief points via client app
