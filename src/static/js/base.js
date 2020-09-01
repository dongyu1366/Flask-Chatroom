
document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Get the username & current room
    var username = localStorage.getItem("username");
    var current_room = localStorage.getItem("current_room");

    // If no username in local storege, prompt to create one
    if (!localStorage.getItem("username")) create_username();

    //if no current room in local storege, create a default room
    if (!current_room) {
        current_room = "Homepage";
        localStorage.setItem('current_room', current_room);
    }

    // Join current room
    joinRoom(current_room);

    // Render username on the webpage
    document.querySelector('#username').innerHTML = localStorage.getItem('username');

    // Change username
    document.querySelector('#username').onclick = () => {
        username = prompt("Your name: ", "guest");
        if (isEmptyOrSpaces(username)) {
            pass;
        } else {
            username = username;
        }

        // Update username
        localStorage.setItem('username', username);
    }

    // Room selection
    document.querySelectorAll('.select-channel').forEach(li => {
        li.onclick = () => {
            let new_room = li.innerText;
            if (new_room === current_room) {
                message = `You are alread in the ${current_room} channel.`;
                printSysMsg(message);
            } else {
                leaveRoom(current_room);
                joinRoom(new_room);
                current_room = new_room;
                localStorage.setItem('current_room', current_room);
            }
        }
    });

    // Go to homepage
    document.querySelector('#homepage').onclick = () => {
        leaveRoom(current_room);
        current_room = "Homepage";
        localStorage.setItem('current_room', current_room);
    }

    // Redirect to current room page
    if (localStorage.getItem('current_room')) {
        const current_room = localStorage.getItem('current_room');
        const url = window.location.origin + `/channels/${current_room}`
        if (current_room != "Homepage" && window.location.href != url) {
            window.location.replace(url);
        } else if (current_room === "Homepage" && window.location.href != window.location.origin + '/') {
            window.location.replace(window.location.origin)
        }
    }

    // Create new channels
    document.querySelector('#form').onsubmit = () => {

        // Initialize new request
        const request = new XMLHttpRequest();
        const new_channel = document.querySelector('#create_channel').value;
        request.open('POST', '/create_channel');

        // Callback function for when request completes
        request.onload = () => {

            // Extract JSON data from request
            const data = JSON.parse(request.responseText);

            if (data.success) {
                alert("You have created the new channel!");
            } else {
                alert("The channel already exists.");
            }
        }

        // Add data to send with request
        const data = new FormData();
        data.append('new_channel', new_channel);

        // Send request
        request.send(data);
    }


    // Leave Rooms function
    function leaveRoom(room) {
        socket.emit('leave', {
            'username': username,
            'room': room
        });
    }

    // Join Room function
    function joinRoom(room) {
        socket.emit('join', {
            'username': username,
            'room': room
        });
    }
});


// Create a username function
function create_username() {
    // Create a drfault username in localstorage
    localStorage.setItem('username', 'guest')

    // Prompt the user to create a username
    username = prompt("Please enter your name", "guest");
    if (isEmptyOrSpaces(username)) {
        username = guest;
    } else {
        username = username;
    }
    localStorage.setItem('username', username);
}

// Check the input string is empty or spaces function
function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function printSysMsg(message) {
    const p = document.createElement('p');
    p.innerHTML = message;
    document.querySelector('#message-area').append(p);
}