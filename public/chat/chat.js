document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    socket.on('connect', () => {
        console.log('Socket.IO connected!');
    });

    let currentUser = null;
    let currentGroup = null;
    let groups = [];
    let groupMessages = {};

    const form = document.querySelector('#form');
    const input = document.querySelector('#m');
    const messages = document.querySelector('#messages');
    const groupList = document.querySelector('#group-list');
    const createGroupForm = document.querySelector('#create-group-form');
    const groupNameInput = document.querySelector('#group-name');

    const addMessageToChat = (msg) => {
        const li = document.createElement('li');
        const isCurrentUser = msg.user === currentUser;
    
        li.classList.add(isCurrentUser ? 'sent' : 'received');
    
        const messageDiv = document.createElement('div');
        
        if (!isCurrentUser) {
            const senderName = document.createElement('span');
            senderName.textContent = `${msg.user}: `;
            senderName.classList.add('sender-name');
            messageDiv.appendChild(senderName);
        }
    
        messageDiv.textContent += msg.message;
        li.appendChild(messageDiv);
    
        messages.appendChild(li);
    
        messages.scrollTop = messages.scrollHeight;
    };
    
    

    const updateGroupList = (groups) => {
        groupList.innerHTML = '';
        groups.forEach((group) => {
            const li = document.createElement('li');
            li.textContent = group.name;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteGroup(group.id);
            });

            li.appendChild(deleteButton);

            li.addEventListener('click', () => {
                console.log('Switching group:', group);
                switchGroup(group);
            });

            groupList.appendChild(li);
        });
    };

    const switchGroup = (group) => {
        console.log('Switching to group:', group);
        currentGroup = group;
        console.log('Current group:', currentGroup);
        messages.innerHTML = '';

        if (currentGroup) {
            console.log('Requesting chat history for group:', currentGroup.id);
            socket.emit('request chat history', currentGroup.id);

            const selectedGroupElement = document.getElementById('selected-group');
            if (selectedGroupElement) {
                selectedGroupElement.textContent = `Selected Group: ${group.name}`;
            }
        }
    };

    const deleteGroup = (groupId) => {
        console.log('Deleting group with ID:', groupId);

        axios.delete(`/user/group/delete/${groupId}`)
            .then((response) => {
                const updatedGroups = response.data.groups;
                updateGroupList(updatedGroups);

                if (currentGroup && currentGroup.id === groupId) {
                    currentGroup = null;
                    const selectedGroupElement = document.getElementById('selected-group');
                    if (selectedGroupElement) {
                        selectedGroupElement.textContent = 'Selected Group: None';
                    }
                }
            })
            .catch((error) => {
                console.error('Error deleting group', error);
            });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Submit button clicked');
        if (input.value && currentGroup) {
            console.log('Sending chat message:', { user: currentUser, message: input.value, group: currentGroup });
            socket.emit('chat message', { user: currentUser, message: input.value, group: currentGroup });
            input.value = '';
        }
    });

    createGroupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Create Group button clicked');
        const groupName = groupNameInput.value;
        if (groupName) {
            axios.post('/user/group/create', { name: groupName })
                .then((response) => {
                    const newGroup = response.data.group;
                    groups = [...groups, newGroup];
                    updateGroupList(groups);
                    groupNameInput.value = '';
                })
                .catch((error) => {
                    console.error('Error creating group', error);
                });
        }
    });

    socket.on('chat message', (msg) => {
        console.log('Received chat message:', msg);
        addMessageToChat(msg);
        if (!groupMessages[currentGroup.id]) {
            groupMessages[currentGroup.id] = [];
        }
        groupMessages[currentGroup.id].push(msg);
    });

    socket.on('chat history', (history) => {
        console.log('Received chat history:', history);

        if (currentGroup) {
            groupMessages[currentGroup.id] = history;

            history.forEach((msg) => {
                addMessageToChat(msg);
            });
        } else {
            console.error('Current group is null or undefined');
        }
    });

    socket.on('group list', (updatedGroups) => {
        console.log('Received updated group list:', updatedGroups);
        groups = updatedGroups;
        updateGroupList(groups);
    });

    socket.on('group messages', (groupMessages) => {
        console.log('Received group messages:', groupMessages);
        messages.innerHTML = '';
        groupMessages.forEach((msg) => {
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

    axios.get('/user/group/list')
        .then((response) => {
            const fetchedGroups = response.data.groups;
            groups = fetchedGroups;
            updateGroupList(groups);
            if (currentGroup) {
                socket.emit('request chat history', currentGroup.id);
            }
        })
        .catch((error) => {
            console.error('Error fetching group list', error);
        });
});