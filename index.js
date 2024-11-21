

const path = require('path');
const express=require('express');
const app = express(); 

//setings
app.set('port',process.env.PORT || 3000);

//static files
// console.log(__dirname);
app.use(express.static(path.join(__dirname,'public'))) ;

//star the server
const server=app.listen(app.get('port'),()=>{
    console.log('server on port',app.get('port'));
});

const SocketIO=require('socket.io');
const io=SocketIO(server);

let arr=[]
let playingArray=[]
//websockets
io.on("connection",(socket)=>{
    console.log("new connection",socket.id);
    
    socket.on("find",(e)=>{

        if(e.name!=null){

            arr.push(e.name)

            if(arr.length>=2){
                let p1obj={
                    p1name:arr[0],
                    p1value:"X",
                    p1move:""
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"O",
                    p2move:""
                }

                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArray.push(obj)

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArray})

            }

        }

    })

    socket.on("playing",(e)=>{
        
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)

            objToChange.p1.p1move=e.id
            objToChange.sum++
        }
        else if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)

            objToChange.p2.p2move=e.id
            objToChange.sum++
        }

        io.emit("playing",{allPlayers:playingArray})

    })

    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
        console.log("lol")
    })



    //MENSAJES

    socket.on('chat:message',(data)=>{
        io.sockets.emit("chat:message",data);
    })

    socket.on('chat:typing',(data)=>{
        // console.log(data); 
        socket.broadcast.emit('chat:typing',data);
    })
    socket.on('chat:stoppedTyping', function () {
        socket.broadcast.emit('chat:stoppedTyping');
    });
    // Manejar envío de stickers
    socket.on("chat:sticker", function (data) {
        io.sockets.emit("chat:sticker", data);
    });









    socket.on("playing2", (data) => {
        const game = games[data.gameId]; // Busca el juego actual
        const player = game.players.find((p) => p.name === data.name);
    
        if (player) {
            player.move = data.id; // Registra el movimiento del jugador
    
            game.sum += 1; // Incrementa la suma de turnos
    
            io.emit("playing", {
                allPlayers: game.players,
                sum: game.sum, // Incluye el estado de la suma para calcular el turno
            });
        }
    });
    
    
});



