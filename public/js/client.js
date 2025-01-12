const socket = io('http://localhost:8000');

const form = document.getElementById('send-con');
const msgInp = document.getElementById('msgInp');
const messageContainer = document.querySelector(".container"); // msg iske andar daalne h

var audio = new Audio('bing.mp3');

// Function that appends event to the container
const append = (message, position) => {
    const messageEle = document.createElement('div');
    messageEle.innerText = message;
    messageEle.classList.add('message');
    messageEle.classList.add(position);
    messageContainer.append(messageEle);
    if (position == 'left') {
        audio.play();
    }
}

// Ask new user for their name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, let the server know or receive their name event from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// If the server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// If a user leaves the chat
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});

// If the form gets submitted, send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msgInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    msgInp.value = '';
});
