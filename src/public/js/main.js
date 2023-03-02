let binary = undefined;
const socket = io();
const messageForm = document.getElementById("message-form");
const messageBox = document.getElementById("message");
const chat = document.getElementById("chat");
const nickForm = document.getElementById("nickForm");
const nickName = document.getElementById("nickName");
const users = document.getElementById("usernames");
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");


function privateMessage(boton){
    const id = boton.id;
    console.log(id);
    const command  = "/p "+id+ " ";
    messageBox.value = command;
}

uploadForm.addEventListener("submit", (event) => {
    event.preventDefault(); // evitar envío por solicitud HTTP
    console.log(fileInput);
    const file = fileInput.files[0];
    console.log(file);
    const fileName = file.name;
    console.log(fileName);
           // emitir evento al servidor para subir el archivo
             socket.emit("upload", { file, fileName });
        
});

socket.on("uploadSuccess", () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Archivo subido exitosamente',
        showConfirmButton: false,
        timer: 1500
      })
});

socket.on("uploadError", () => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
});

socket.on('anuncio', () => {
    let mensaje = 'Alguien ha mandado un archivo'
    chat.insertAdjacentHTML(
        "beforeend",
        `<p class="whisper"><b>${mensaje}</b></p>`
    );
});



nickForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("new user", nickName.value, (data) => {
        if (data) {
            if(nickName.value === ''){
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Ingresa un nombre de usuario',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  return;
            }else{
                Swal.fire({
                    position: 'center',
                    title: 'Bienvenido al chat '+ nickName.value,
                    showConfirmButton: false,
                    timer: 1000
                  });
                document.getElementById("nickWrap").style.display = "none";
                document.getElementById("contentWrap").classList.remove("contentWrap");
            }
        } else { Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Nombre de usuario no disponible',
            showConfirmButton: false,
            timer: 1500
          })
        }
        nickName.value = "";
    });
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("message", { text: messageBox.value, img: binary }, (data) => {
        chat.insertAdjacentHTML("beforeend", `<p class="error">${data}</p>`);
    });
    messageBox.value = "";
});

socket.on("new message", (data) => {
    if(data.message === ''){
        return;
    }
    chat.insertAdjacentHTML("beforeend", `<b>${data.nick}: </b>${data.msg}<br>`);
});

socket.on("usernames", (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html += `<button onclick="privateMessage(this)" id="${data[i]}" class="color-active" ><i class="fas fa-user"></i> ${data[i]}</button><br>`;
    }
    users.innerHTML = html;
});

socket.on("private", (data) => {
    chat.insertAdjacentHTML(
        "beforeend",
        `<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`
    );
});
