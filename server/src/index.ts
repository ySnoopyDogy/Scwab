import Game from './Game'

require('dotenv').config()
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const game = new Game(io)
game.init()

server.listen(process.env.PORT, () => console.log('[SERVER] On on port ' + process.env.PORT))