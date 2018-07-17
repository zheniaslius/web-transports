const sendMessage = document.querySelector('#send-message');
const messageContainer = document.querySelector('.messages-wrp');
const messageBox = document.querySelector('#message');
const dialog = document.querySelector('.dialog');
const start = document.querySelector('#start');
const name = document.querySelector('#name');
const nick = document.querySelector('#nick');
const names = document.querySelector('.names');
const typing = document.querySelector('.typing');

const socket = io.connect();

let personName, personNick;

start.addEventListener('click', e => {
    personName = name.value || 'Person';
    personNick = nick.value || 'CoolGuy';
    dialog.style.display = 'none';
    socket.emit('user', ({personName, personNick}));
})

sendMessage.addEventListener('click', () => {
    const message = messageBox.value || 'Hello';
    let data = {
        personName,
        personNick,
        message
    };
    socket.emit('message', data);
    messageBox.value = '';
})

messageBox.addEventListener('keypress', () => {
    socket.emit('typing', personNick);
})

const addMessage = message => {
    let msg = document.createElement('div');
    msg.classList.add('col-sm-4', 'msg');
    msg.innerHTML = `<div class="message-info mb-3">
        <div class="mb-2">
            <span class="user-name font-weight-bold">${message.personName}</span>
            <span class="nickname">(@${message.personNick})</span>
        </div>
        <p>${message.message}</p>
    </div>`;

    if (message.message.includes(`@${personName}`) &&
        message.personName != personName) {
        msg.classList.add('highlighted');
    }
    messageContainer.appendChild(msg);
}

const addParticipant = msg => {
    let user = `<li>
    <span>${msg.personName}</span>
    <span>(@${msg.personNick})</span>
    </li>`;
    names.insertAdjacentHTML('afterbegin', user);
}

socket.on('typing', user => {
    typing.innerHTML = `${user} is typing...`;
    console.log(`${user} is typing`);
})

socket.on('stopped typing', () => {
    typing.innerHTML = '';
    console.log('stopped typing');
})

socket.on('user', user => addParticipant(user));

socket.on('users', users => {
    users.forEach(i => addParticipant(i));
});

socket.on('message', msg => {
    addMessage(msg);
})

socket.on('history', res => {
    messageContainer.innerHTML = '';
    for (let msg of res.slice(-100)) {
        addMessage(msg);
    }
})

socket.on('disconnect', user => {
    typing.innerHTML = `<span>${user} left the chat</span>`;
})
