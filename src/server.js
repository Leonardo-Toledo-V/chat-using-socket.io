const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
const port = 3000;
const rateLimit = require('express-rate-limit');

app.set('port', process.env.PORT || port);

//Limitar el número de conexiones por dirección IP
 const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutos
   max: 3 * 4, // límite de 3 conexiones por IP, el archivo html, consume 4 peticiones por 1 peticion que haga el usuario
    message: 'Demasiadas conexiones desde esta dirección IP, intente de nuevo en unos minutos.'
});

app.use(limiter);

require('./sockets')(io);

// Static files
app.use(express.static(path.join(__dirname,'public')));

// Create a server 
server.listen(app.get('port'), ()=>{
    console.log('listening on port '+ app.get('port'));
});

