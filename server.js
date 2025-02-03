const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { disconnect } = require("process");
const { Socket } = require("socket.io");
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = 3000;

// ルートアクセスで `index.html` を表示
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
});
// `/login` にアクセスしたら `login.html` を送る
app.get("/login",(req,res)=>{
    res.sendFile(__dirname + "/public/login.html");
});

// `/chat` にアクセスしたら `chat.html` を送る
app.get("/chat",(req,res)=>{
    res.sendFile(__dirname + "/public/chat.html");
});

app.use(express.static("public"));//クライアント側のHTMLファイルを配信
app.use(express.static(path.join(__dirname,"public")))

io.on("connection", (socket) => {

    console.log("誰かが来たぞ🎉");

    //部屋に入る
    socket.on("join room", ({username,room}) => {
        socket.username = username;
        socket.room = room;
        socket.join(room);
        console.log(`${username}が${room}に入室したぞよ！`)
    });


    //メッセージを受信
    socket.on("chat message", ({room,message}) => {
        io.to(room).emit("chat message",message);
    });

    //切断時
    socket.on("logout",()=>{
        if(socket.username && socket.room){
            io.to(socket.room).emit("chat message",`👋 ${socket.username} が退室しました！`);
            socket.leave(socket.room);

        }
        socket.disconnect();
    });



    socket.on("disconnect",()=>{
        console.log(`${socket.username}が切断されました`)
    });


});


server.listen(PORT, () => {
    console.log("サーバーできてるぞ！すごい！🚀")
});