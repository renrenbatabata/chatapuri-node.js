const express = require("express");
const app = express();
const http = require("http");
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


io.on("connection", (socket) => {

    console.log("誰かが来たぞ🎉");

    //ユーザーが名前を送ってきたら保存
    socket.on("set username", (username) => {
        socket.username = username;
    });


    //メッセージを受信
    socket.on("chat message", (msg) => {
        if(socket.username){
        io.emit("chat message", `${socket.username}: ${msg}`);
        }else{
            socket.emit("chat message","⚠️ 名前を設定してください！")
        }
    });

    //切断時
    socket.on("logout",()=>{
        if(socket.username){
            io.emit("chat message",`👋 ${socket.username} が退室しました！`)
        }
    });

    socket.on("disconnect",()=>{
        console.log(`${socket.username}が切断されました`)
    });


});


server.listen(PORT, () => {
    console.log("サーバーできてるぞ！すごい！🚀")
});