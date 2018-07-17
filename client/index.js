const sendMessage = document.querySelector('#send-message');
const messageContainer = document.querySelector('.messages-wrp');
const messageBox = document.querySelector('#message');
const dialog = document.querySelector('.dialog');
const start = document.querySelector('#start');
const name = document.querySelector('#name');
const nick = document.querySelector('#nick');
const names = document.querySelector('.names');

let personName, personNick;

const subscribe = () => {
    setInterval(() => getMessages(), 1000);
}

start.addEventListener('click', e => {
    personName = name.value || 'Person';
    personNick = nick.value || 'CoolGuy';
    dialog.style.display = 'none';
})

sendMessage.addEventListener('click', () => {
    const message = messageBox.value || 'Hello';
    axios.post('/messages', {
        personName,
        personNick,
        message
    })
    .catch(err => console.log(err));
    messageBox.value = '';
    subscribe();
})

const addMessage = message => {
    let time = new Date();
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
    let user = `<div>
    <span>${msg.personName}</span>
    <span>(${msg.personNick})</span>
    </div>`;
    names.insertAdjacentHTML('afterbegin', user);
}

const getMessages = () => {
    axios.get('/messages')
    .then(res => {
        messageContainer.innerHTML = '';
        names.innerHTML = '';
        for (let msg of res.data.slice(-100)) {
            addMessage(msg);
            addParticipant(msg);
        }
        console.log(res);
    });
}

getMessages();