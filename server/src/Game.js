const availableCards = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
]


class Game {
  constructor(io) {
    this.io = io;
    this.players = new Map()
    this.gameRunning = false;
    this.game = {};
  }

  init() {
    this.io.on('connection', (socket) => {
      if (this.gameRunning) {
        socket.emit('game-full', { msg: 'Perdão, o jogo já está cheio' });
        socket.disconnect()
        return;
      }
      this.connect(socket)
      if(this.checkStart()) this.startGame()


      socket.on('disconnect', () => this.disconnect(socket.id))
    })
  }
  connect(socket) {
    this.players.set(socket.id, socket)
    console.log('[CLIENT] New Client Connected')
    this.checkStart();
  }

  disconnect(id) {
    this.players.delete(id);
    console.log("[CLIENT] A Client Disconnected");
  }

  startGame() {
    this.gameRunning = true;
    const cardsShufled = availableCards.sort(() => Math.random() - 0.5)
    const inTableCards = cardsShufled.splice(0, 4)
    const firstUserCards = cardsShufled.splice(5, 18)
    const secondUserCards = cardsShufled.splice(-18)

    const firstHandFirstUser = firstUserCards.splice(0, 3);
    const firstHandSecondUser = secondUserCards.splice(0, 3);

    const keys = [...this.players.keys()]

    console.log(keys)

    this.game = {
      inTableCards,
      player1: {
        id: keys[0],
        mountCards: firstUserCards.splice(-15),
        escobas: 0,
        handCards: firstHandFirstUser
      },
      player2: {
        id: keys[1],
        mountCards: secondUserCards.splice(-15),
        escobas: 0,
        handCards: firstHandSecondUser
      }
    }

    // TODO: Fix this 

    this.io.sockets.connected[keys[0]].emit('cards', this.game.player1)
    this.io.sockets.connected[keys[1]].emit('cards', this.game.player2)
  }

  checkStart() {
    if (this.players.size === 2) return true
    return false
  }
}

module.exports = Game