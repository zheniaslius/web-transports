const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let messages = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    socket.on('message', msg => {
        messages.push(msg);
        io.emit('message', msg);
    })

    socket.emit('history', messages);
})

server.listen(8000, () => console.log('Listening'));