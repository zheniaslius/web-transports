const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let messages = [];
let users = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', socket => {
    socket.on('message', msg => {
        messages.push(msg);
        io.emit('message', msg);
    })
    socket.emit('history', messages);

    socket.on('user', user => {
        socket.username = {user};
        users.push(user);
        io.emit('user', user);
    })
    socket.emit('users', users);

    socket.on('typing', nick => {
        socket.broadcast.emit('typing', nick);
    })

    socket.on('stopped typing', () => {
        socket.broadcast.emit('stopped typing');
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user left', socket.username);
        users = users.filter(user => 
            user.personNick != socket.username);
    })

})

server.listen(8000, () => console.log('Listening'));