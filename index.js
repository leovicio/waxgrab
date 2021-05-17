const express = require('express');
const bodyParser = require('body-parser');
const rewrite = require('express-urlrewrite');
const request = require('request');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
  next();
});

app.use(rewrite('/getatoom/*', '/atomicassets?query=$1'));
app.use(rewrite('/getwaxden/*', '/waxsweden?query=$1'));


app.get("/atomicassets", (req, res) => {
  // read query parameters
  const pathreq = req.query["query"];

  // craft IEX API URL
  const url = `https://wax.api.atomicassets.io/atomicassets/v1/assets/${pathreq}`;

  // make request to IEX API and forward response
  request(url).pipe(res);
});

app.post("/waxsweden", (req, res) => {
  // read query parameters
  const pathreq = req.query["query"];
  const sendbody = req.body;

  // craft IEX API URL
  const url = `https://api.waxsweden.org/v1/chain/${pathreq}`;
  
  request.post({
    url: url,
    body: sendbody,
    json: true
  }).pipe(res);;
  
	
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`http://localhost:${port}`))