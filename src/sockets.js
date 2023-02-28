
module.exports = function(io){
    let users = {

    };
    io.on('connection',socket =>{
        console.log('New user connected');
        
        socket.on('message',(data)=> {
            console.log(data + 'Hola mundo')
            var msg = data.text.trim();
            if(msg.substr(0,3)=== '/p '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index!== -1){
                   var name =  msg.substring(0,index)
                    var msg = msg.substring(index + 1)
                    if (name in users){
                        users[name].emit('private',{
                            msg,
                            nick: socket.nickname
                        });
                    }else{
                        cb('Por favor entra un nombre de usuario valido');
                    }
                }else {
                    cb('Por favor ingresa un mensaje')
                }
            }else{
                io.sockets.emit('new message', {
                    msg: data.text,
                    nick:socket.nickname,
                    img: data.img
                });
            }
        });

        socket.on('new user', (data,cb) => {
            console.log(data);
            if(data in users) {
            cb(false, data);
            }else{
                cb(true, data);
                socket.nickname = data;
                users[socket.nickname]=socket;
                updateNicknames();
            }
        });

        socket.on('disconnect', data =>{
            if(!socket.nickname)return;
           delete users[socket.nickname];
            updateNicknames();
        });
        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }

    });
}