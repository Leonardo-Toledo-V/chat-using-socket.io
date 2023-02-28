$(function() {
    const socket = io();
    //Obtaining DOM element from the interface
    const messageForm= $('#message-form');
    const messageBox= $('#message');
    const chat= $('#chat');
    
    const nickForm = $('#nickForm');
    const nickError = $('#nickError');
    const nickName = $('#nickName');

    const users = $('#usernames');

    nickForm.submit(e=>{
        e.preventDefault();
        socket.emit('new user',nickName.val(), data=>{
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').removeClass('contentWrap');
            }else{
               nickError.html(`
            <div class="font-bold text-red-700">
                El nombre del usuario ya existe
            </div>
               `);
            }
            nickName.val('');
        });
    });

    messageForm.submit( e => {
        e.preventDefault();
        socket.emit('message',messageBox.val(), data=>{
            chat.append(`<p class="error">${data}</p>`)
        });
        messageBox.val('');
    });
    socket.on('new message', function(data) {
        chat.append('<b>' + data.nick + '</b>'+' : '+ data.msg + '<br/>');
    });

    socket.on('usernames', data=>{
        let html= '';
        for (let i=0; i<data.length; i++){
            html += `<p><i class="fas fa-user"> </i>    ${data[i]}</p>`
        }
        users.html(html);
    });

    socket.on('private',data =>{
        chat.append(`<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`);
    });
});

