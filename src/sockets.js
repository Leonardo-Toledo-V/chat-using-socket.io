
module.exports = function(io){
    io.on('connection',socket =>{
        console.log('New user connected');
        socket.on('message',function(data) {
            io.sockets.emit('new message', data);
        });
    });
}