# Relief Map Example

This project was inspired by [relieftt.org](www.relieftt.org). This repo is a simple setup for a client/server for displaying relief points stored on a public Google spreadsheet. Also includes Procfile for Heroku deployment

## Features

- Server to read from public Google spreadsheet of relief points
- Client app (made with `create-react-app`) that displays the relief points on a map (using `mapbox-gl.js`)

## Setup Instructions

- Clone repo to local machine
- Download Google Cloud authorization json file. [View instructions here](https://cloud.google.com/docs/authentication/getting-started)
- Rename the downloaded json file to `service-account.json` and copy-paste the file to the `server` sub-folder
- Create a new heroku app
- Set heroku Environment variables using `heroku config:set CREDS="server/service-account.json"` and confirm using `heroku config:get CREDS`
- Upload to heroku app

## Todo

- [x] Pull data from spreadsheet using Google Spreadsheet API
- [x] Setup REST API
- [x] Display relief points using Mapbox in React app
- [ ] Extend REST API to CRUD (create, update, delete) relief points
- [ ] Submit new relief points via client app
