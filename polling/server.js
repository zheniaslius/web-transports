const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let messages = [];

app.use(express.static('./'));

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/messages', (req, res) => {
    messages.push(req.body);
});

app.listen(8000, () => console.log('Listening'));