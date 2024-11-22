    document.getElementById("loading").style.display = "none"
    document.getElementById("game-container").style.display = "none"
    document.getElementById("chat-container").style.display = "none"

    const socket = io();

    let name;

    document.getElementById('find').addEventListener("click", function () {
        name = document.getElementById("name").value
        document.getElementById("user").innerText = name
        if (name == null || name == '') {
            alert("Please enter a name")
        }
        else {

            socket.emit("find", { name: name })

            document.getElementById("loading").style.display = "block"
            document.getElementById("find").disabled = true;

        }
    })



    socket.on("find", (e) => {


        let allPlayersArray = e.allPlayers
        console.log("html",allPlayersArray)

        if (name != '') {
            document.getElementById("titulo").style.margin = "0px"
            document.getElementById("titulo").style.marginBottom  = "30px"
            document.getElementById("loading").style.display = "none"
            document.getElementById("name").style.display = "none"
            document.getElementById("find").style.display = "none"
            document.getElementById("enterName").style.display = "none"
            document.getElementById("game-container").style.display = "flex"
            document.getElementById("chat-container").style.display = "block"
            document.getElementById("whosTurn").innerText = "X's Turn"
        }

        let oppName
        let value

        const foundObject = allPlayersArray.find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);
        foundObject.p1.p1name == `${name}` ? oppName = foundObject.p2.p2name : oppName = foundObject.p1.p1name
        foundObject.p1.p1name == `${name}` ? value = foundObject.p1.p1value : value = foundObject.p2.p2value

        document.getElementById("oppName").innerText = oppName
        document.getElementById("value").innerText = value


    })

    document.querySelectorAll(".btn").forEach(e => {
        e.addEventListener("click", function () {
            let value = document.getElementById("value").innerText
            e.innerText = value

            socket.emit("playing", { value: value, id: e.id, name: name })

        })
    })

    socket.on("playing", (e) => {
        const foundObject = (e.allPlayers).find(obj => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`);

        p1id = foundObject.p1.p1move
        p2id = foundObject.p2.p2move

        if ((foundObject.sum) % 2 == 0) {
            document.getElementById("whosTurn").innerText = "Turno de O"
        }
        else {
            document.getElementById("whosTurn").innerText = "Turno de X"
        }

        if (p1id != '') {
            document.getElementById(`${p1id}`).innerText = "X"
            document.getElementById(`${p1id}`).disabled = true
            document.getElementById(`${p1id}`).style.color = "black"
            document.getElementById(`${p1id}`).style.backgroundColor = "#ff9999"
        }
        if (p2id != '') {
            document.getElementById(`${p2id}`).innerText = "O"
            document.getElementById(`${p2id}`).disabled = true
            document.getElementById(`${p2id}`).style.color = "black"
            document.getElementById(`${p2id}`).style.backgroundColor = "#99ccff"
        }

        check(name, foundObject.sum)


    })

    function check(name, sum) {


        document.getElementById("btn1").innerText == '' ? b1 = "a" : b1 = document.getElementById("btn1").innerText
        document.getElementById("btn2").innerText == '' ? b2 = "b" : b2 = document.getElementById("btn2").innerText
        document.getElementById("btn3").innerText == '' ? b3 = "c" : b3 = document.getElementById("btn3").innerText
        document.getElementById("btn4").innerText == '' ? b4 = "d" : b4 = document.getElementById("btn4").innerText
        document.getElementById("btn5").innerText == '' ? b5 = "e" : b5 = document.getElementById("btn5").innerText
        document.getElementById("btn6").innerText == '' ? b6 = "f" : b6 = document.getElementById("btn6").innerText
        document.getElementById("btn7").innerText == '' ? b7 = "g" : b7 = document.getElementById("btn7").innerText
        document.getElementById("btn8").innerText == '' ? b8 = "h" : b8 = document.getElementById("btn8").innerText
        document.getElementById("btn9").innerText == '' ? b9 = "i" : b9 = document.getElementById("btn9").innerText


        if ((b1 == b2 && b2 == b3) || (b4 == b5 && b5 == b6) || (b7 == b8 && b8 == b9) || (b1 == b4 && b4 == b7) || (b2 == b5 && b5 == b8) || (b3 == b6 && b6 == b9) || (b1 == b5 && b5 == b9) || (b3 == b5 && b5 == b7)) {

            socket.emit("gameOver", { name: name })

            setTimeout(() => {

                sum % 2 == 0 ? alert("X WON !!") : alert("O WON !!")

                setTimeout(() => {
                    location.reload()

                }, 2000)

            }, 100)

        }

        else if (sum == 10) {
            socket.emit("gameOver", { name: name })

            setTimeout(() => {

                alert("DRAW!!")

                setTimeout(() => {
                    location.reload()

                }, 2000)

            }, 100)
        }
    }




// // Variable para guardar el turno
// let currentTurn = "X"; // Empieza con X

// document.querySelectorAll(".btn").forEach((e) => {
//     e.addEventListener("click", function () {
//         let value = document.getElementById("value").innerText;

//         // Verifica si el jugador tiene el turno
//         if (value === currentTurn) {
//             e.innerText = value; // Marca el botón
//             e.disabled = true; // Desactiva el botón actual
//             e.style.color = "black";

//             // Envía la acción al servidor
//             socket.emit("playing", { value: value, id: e.id, name: name });

//             // Cambia el turno localmente
//             currentTurn = currentTurn === "X" ? "O" : "X";
//         } else {
//             alert("Es el turno del otro jugador.");
//         }
//     });
// });

// // Actualiza el turno recibido del servidor
// socket.on("playing2", (e) => {
//     const foundObject = e.allPlayers.find(
//         (obj) => obj.p1.p1name == `${name}` || obj.p2.p2name == `${name}`
//     );

//     p1id = foundObject.p1.p1move;
//     p2id = foundObject.p2.p2move;

//     // Sincroniza el turno
//     currentTurn = (foundObject.sum % 2 === 0) ? "O" : "X";

//     if (p1id != "") {
//         document.getElementById(`${p1id}`).innerText = "X";
//         document.getElementById(`${p1id}`).disabled = true;
//         document.getElementById(`${p1id}`).style.color = "black";
//     }
//     if (p2id != "") {
//         document.getElementById(`${p2id}`).innerText = "O";
//         document.getElementById(`${p2id}`).disabled = true;
//         document.getElementById(`${p2id}`).style.color = "black";
//     }

//     // Verifica la condición de victoria o empate
//     check(name, foundObject.sum);
// });


//LOGICA PARA MENSAJES
console.log("codigo ccccc")
// const socket2=io();

// DOM elements
let messages=document.getElementById("messages");
// let username=document.getElementById("username");
let username=document.getElementById("name");
let btn=document.getElementById("send");
let output=document.getElementById("output");
let actions=document.getElementById("actions");

btn.addEventListener("click",function(){
    if (message.value.trim() !== "") { 
        socket.emit('chat:message', {
            message: message.value,
            username: username.value
        });
        message.value = "";
    } else {
        alert("El mensaje no puede estar vacío.");
    }
});

// message.addEventListener("keypress",function(){
//     socket.emit('chat:typing',username.value);
// });

message.addEventListener("input", function () {
    if (message.value.trim() !== "") {
        // Si el campo no está vacío, notificar que está escribiendo
        socket.emit('chat:typing', username.value);
    } else {
        // Si el campo está vacío, notificar que dejó de escribir
        socket.emit('chat:stoppedTyping', username.value);
    }
});

// socket.on('chat:message',function(data){
//     // console.log(data);
//     actions.innerHTML='';
//     output.innerHTML+=`<p><strong>${data.username}</strong>:${data.message}</p>`;

    
// });

socket.on('chat:message', function (data) {
    // Determina si el mensaje fue enviado por el usuario actual o por otro
    let messageClass = data.username === username.value ? "sent" : "received";

    // Añade el mensaje al contenedor con la clase adecuada
    output.innerHTML += `
        <div class="message ${messageClass}">
            <strong>${data.message}
        </div>
    `;

    // Limpia el indicador de "escribiendo"
    actions.innerHTML = '';
});


socket.on('chat:typing',function(data){
    // console.log(data);
    actions.innerHTML=`<p><em>${data} esta escribiendo</em></p>`;
});
socket.on('chat:stoppedTyping', function () {
    actions.innerHTML = ''; // Limpiar notificación
});

// socket.on("disconnect", () => {
//     alert("Conexión perdida. Intenta reconectar.");
//     location.reload();
// });

// Referencia al panel de stickers
let stickerPanel = document.getElementById("sticker-panel");

// Evento para seleccionar un sticker
stickerPanel.addEventListener("click", function (event) {
    if (event.target.classList.contains("sticker")) {
        let stickerSrc = event.target.getAttribute("src");
        socket.emit("chat:sticker", {
            username: username.value,
            sticker: stickerSrc
        });
    }
});

// Mostrar stickers recibidos
socket.on("chat:sticker", function (data) {
    output.innerHTML += `<p><strong>${data.username}</strong>: <img src="${data.sticker}" class="sticker-message"></p>`;
});
