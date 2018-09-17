// our dependencies
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Config bodyparser to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// from top level path e.g. localhost:3000, this response will be sent
app.get('/', (request, response) => response.send('Hello World'));

//Basic GET request
app.get("/hello", function(req, res) {
  if(!req.query.name) {
      return res.send({"status": "error", "message": "missing a parameter"});
  } else {
      return res.send("Welcome back, "+req.query.name);
  }
});

//Basic POST request
app.post("/hello", function(req, res) {
  if(!req.body.name) {
      return res.send({"status": "error", "message": "missing a parameter"});
  } else {
      return res.send("Welcome back, "+req.body.name);
  }
});

// set the server to listen on port 3000
app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));
