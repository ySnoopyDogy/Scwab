require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on("connection", (socket) => {

  let interval;
  console.log("New client connected");

  interval = setInterval(() => {
    const response = new Date();
    socket.emit("FromAPI", response);
  }, 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(process.env.PORT, () => console.log('[SERVER] On on port ' + process.env.PORT))