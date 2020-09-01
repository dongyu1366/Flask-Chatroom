
document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    var private_socket = io(location.protocol + '//' + document.domain + ':' + location.port + '/private');

    // Get the username & current_room
    var username = localStorage.getItem("username");
    var current_room = localStorage.getItem("current_room");

    // Send message
    document.querySelector('#input-msg').onkeyup = () => {

        // Submit buttom is only active when user type message
        if (document.querySelector('#input-msg').value.length > 0)
            document.querySelector('#submit-btn').disabled = false;
        else
            document.querySelector('#submit-btn').disabled = true;

        // Send message to the server
        document.querySelector('#submit-btn').onclick = () => {
            socket.emit('send message', {
                'message': document.querySelector('#input-msg').value,
                'username': username,
                'room': current_room
            })
            document.querySelector('#input-msg').value = '';

            // Disable button again after submit
            document.querySelector('#submit-btn').disabled = true;

            return false;
        }
    }

    // Get message from the server
    socket.on('broadcast message', data => {
        const div = document.createElement('div');
        const span_username = document.createElement('span');
        const span_time = document.createElement('span');
        const p_message = document.createElement('p');
        const hr = document.createElement('hr');
        span_time.setAttribute('class', 'time');
        div.setAttribute('class', 'message-block');
        hr.setAttribute('class', 'message-innerline');

        span_username.innerHTML = data.username;
        span_time.innerHTML = data.time;
        p_message.innerHTML = data.message;
        div.innerHTML = span_username.outerHTML + ' ' + span_time.outerHTML + hr.outerHTML + p_message.outerHTML;
        document.querySelector('#message-area').append(div);
    })

    // Get join and leave room message from the server
    socket.on('message', function (message) {
        console.log(message)
        // const p = document.createElement('p');
        // p.innerHTML = message;
        // document.querySelector('#message-area').append(p);
    });
});