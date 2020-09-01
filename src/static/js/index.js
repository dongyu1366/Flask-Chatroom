document.addEventListener('DOMContentLoaded', () => {
    var private_socket = io(location.protocol + '//' + document.domain + ':' + location.port + '/private');

    // Create a private key
    document.querySelector('#btn-key').onclick = () => {
        var key = document.querySelector('#private-key').value;
        private_socket.emit('private key', key);
    }

    // Send private message to the server
    document.querySelector('#btn-private-send').onclick = () => {
        username = localStorage.getItem('username')
        var private_key = document.querySelector('#key-send').value;
        var private_message = document.querySelector('#private-message-send').value;
        private_socket.emit('private message', { 'username': username, 'key': private_key, 'message': private_message });

        // Clear the message input field
        document.querySelector('#private-message-send').value = '';
    }

    // Get private message from the server
    private_socket.on('new private message', message => {
        alert(message);
    })
})