const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 80;

app.use(bodyParser.json());
app.get('/', (req, res) => res.send({}));
app.get('/tstat', (req, res) => {
  console.log('Get /tstat');
  res.send({
    hold: 1,
    temp: 69,
    tmode: 1,
    t_heat: 68,
    t_cool: 68,
    time: {
      hour: 10,
      minute: 10,
    },
  });
});

app.post('/tstat', (req, res) => {
  console.log(`Post /tstat ${JSON.stringify(req.body)}`);
  res.send({});
});

app.listen(port, () => console.log(`Fake Thermostatat app listening on port ${port}!`));
