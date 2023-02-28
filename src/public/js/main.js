window.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const messageForm = document.getElementById('message-form');
    const messageBox = document.getElementById('message');
    const chat = document.getElementById('chat');
    const nickForm = document.getElementById('nickForm');
    const nickError = document.getElementById('nickError');
    const nickName = document.getElementById('nickName');
    const users = document.getElementById('usernames');
    const foto = document.getElementById('archivo-enviar');
    let binary = undefined;

    nickForm.addEventListener('submit', e => {
        e.preventDefault();
        socket.emit('new user', nickName.value, data => {
            if (data) {
                document.getElementById('nickWrap').style.display = 'none';
                document.getElementById('contentWrap').classList.remove('contentWrap');
            } else {
                nickError.innerHTML = `
          <div class="font-bold text-red-700">
            El nombre del usuario ya existe
          </div>
        `;
            }
            nickName.value = '';
        });
    });

    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log(binary);
        socket.emit('message', {text: messageBox.value, img: binary}, data => {
            chat.insertAdjacentHTML('beforeend', `<p class="error">${data}</p>`);
        });
        messageBox.value = '';
    });

    socket.on('new message', data => {
        if (data.img !== undefined) {
            const imagen = document.createElement('img');
            imagen.src = data.img;
            chat.appendChild(imagen);
        }
        chat.insertAdjacentHTML('beforeend', `<b>${data.nick}: </b>${data.msg}<br>`);
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
        }
        users.innerHTML = html;
    });

    socket.on('private', data => {
        chat.insertAdjacentHTML('beforeend', `<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`);
    });

    foto.addEventListener('change', e =>{
        const archivo = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () =>{
            binary = reader.result;
        };
        reader.readAsDataURL(archivo);
    })
});




