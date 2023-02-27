$(function() {
    const socket = io();
    //Obtaining DOM element from the interface
    const messageForm= $('#message-form');
    const messageBox= $('#message');
    const chat= $('#chat');

    messageForm.submit( e => {
        e.preventDefault();
        socket.emit('message',messageBox.val());
        messageBox.val('');
    });
    socket.on('new message', function(data) {
        chat.append(data + '<br/>');

    });
});

