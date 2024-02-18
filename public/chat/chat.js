document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let currentUser = null;

    const form = document.querySelector('form');
    const input = document.querySelector('#m');
    const messages = document.querySelector('#messages');

    const addMessageToChat = (msg) => {
        const li = document.createElement('li');
        li.textContent = `${msg.user}: ${msg.message}`;
        messages.appendChild(li);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (input.value) {
            socket.emit('chat message', { user: currentUser, message: input.value });
            input.value = '';
        }
    });

    socket.on('chat message', (msg) => {
        addMessageToChat(msg);
    });

    socket.on('chat history', (history) => {
        history.forEach((msg) => {
            addMessageToChat(msg);
        });
    });

    axios.get('/user/current')
        .then((response) => {
            if (response && response.data && response.data.user) {
                currentUser = response.data.user.name;
            }
        })
        .catch((error) => {
            console.error('Error fetching current user information', error);
        });
});
