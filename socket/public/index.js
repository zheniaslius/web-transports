const sendMessage = document.querySelector('#send-message');
const messageContainer = document.querySelector('.messages-wrp');
const messageBox = document.querySelector('#message');
const dialog = document.querySelector('.dialog');
const start = document.querySelector('#start');
const name = document.querySelector('#name');
const nick = document.querySelector('#nick');
const names = document.querySelector('.names');

const socket = io.connect();

let personName, personNick;

start.addEventListener('click', e => {
    personName = name.value || 'Person';
    personNick = nick.value || 'CoolGuy';
    dialog.style.display = 'none';
})

sendMessage.addEventListener('click', () => {
    const message = messageBox.value || 'Hello';
    let data = {
        personName,
        personNick,
        message
    };
    socket.emit('message', data);
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

socket.on('message', msg => {
    addMessage(msg);
})

socket.on('history', res => {
    console.log(res);
    messageContainer.innerHTML = '';
    names.innerHTML = '';
    for (let msg of res.slice(-100)) {
        addMessage(msg);
        addParticipant(msg);
    }
})
