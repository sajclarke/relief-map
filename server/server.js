// our dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const credentials = require('./service-account.json');

const SPREADSHEET_ID = '1mI_GQ83sNUDHUPPeNNxmLfjJzf0LMlS1T2ySgNsWSjc';

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await promisify(doc.useServiceAccountAuth)(credentials);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];

  const cells = await promisify(sheet.getCells)({
    'min-row': 1,
    'max-row': 34,
    'min-col': 1,
    'max-col': 16,
    'return-empty': true
  });
  let cell_keys = [];
  let cell_data = [];
  let row_data = {};
  let row_num = 0;
  for (const cell of cells) {
    // console.log(`${cell.row},${cell.col}: ${cell.value}`)
    if (cell.row == 1) {
      cell_keys.push(cell.value);
    } else {
      if (cell.row != row_num) {
        row_num = cell.row;
        if (Object.keys(row_data).length > 0) {
          cell_data.push(row_data);
        }
        row_data = {};
      }

      // console.log(cell.row, cell.col, cell_keys[cell.col-1], cell.value)
      var key2 = cell_keys[`${cell.col - 1}`];

      row_data[key2] = cell.value;
      // console.log(row_data)
    }
  }

  // console.log(cell_data)
  return cell_data;
}

const app = express();

app.use(cors());
// app.options('*', cors()) // TODO: Add whitelisting

//Config bodyparser to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// from top level path e.g. localhost:3000, this response will be sent
// app.get('/', (request, response) => response.send('Hello World'));

//Basic GET request
// app.get("/hello", function(req, res) {
//   if(!req.query.name) {
//       return res.send({"status": "error", "message": "missing a parameter"});
//   } else {
//       return res.send({'message':"Welcome back, "+req.query.name});
//   }
// });

app.get('/api/points', async (req, res) => {
  const data = await accessSpreadsheet();
  // console.log(data)
  res.json(data);
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// set the server to listen on port 3000
app.listen(process.env.PORT || 5000, () =>
  console.log('Listening on port 5000')
);
