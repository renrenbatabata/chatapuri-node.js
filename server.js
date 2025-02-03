const express = require("express");
const app = express();
const http = require("http");
const { disconnect } = require("process");
const { Socket } = require("socket.io");
const server = http.createServer(app);
const io = require("socket.io")(server);
const PORT = 3000;


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});
app.use(express.static("public"));


io.on("connection", (socket) => {

    console.log("誰かが来たぞ🎉");

    //ユーザーが名前を送ってきたら保存
    socket.on("set username",(username)=>{
        socket.username=username;//各ソケットに名前を保存
        io.emit("chat message",`🔔${username}が入ってきました!`)
    })
    //メッセージを受信
    socket.on("chat message", (msg) => {
        if(socket.username){
        io.emit("chat message", `${socket.username}: ${msg}`);
        }else{
            socket.emit("chat message","⚠️ 名前を設定してください！")
        }
    });

    //切断時
    socket.on("disconnect",()=>{
        if(socket.username){
            io.emit("chat message",`👋 ${socket.username} が退室しました！`)
        }
    })


});


server.listen(PORT, () => {
    console.log("サーバーできてるぞ！すごい！🚀")
});