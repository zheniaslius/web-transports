const app = require('express');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let messages = [];

app.use(express.static('./'));

io.on('conneciton', () => {
    socket.on('message', msg => {
        messges.push(msg);
        io.emit('message', messages);
    })

    socket.emit('history', messages)
})

app.listen(8000, () => console.log('Listening'));