const availableCards = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
]

/* NAIPES
1..10 = OURO
11..20 = ESPADA
21..30 = PAUS
31..40 = COPAS
*/

import { Server, Socket } from 'socket.io'

type PlayerInv = {
  escobas?: number;
  handCards?: Array<number>,
  takenCards?: Array<number>
}

type GameInstante = {
inTableCards?: Array<number>;
mountCards?: Array<number>;
toPlay?: string;
players?: Map<string, PlayerInv>
}

class Game {

  private io: Server
  private players: Map<string, PlayerInv>
  private gameRunning: boolean
  private game: GameInstante;

  constructor(io: Server) {
    this.io = io;
    this.players = new Map()
    this.gameRunning = false;
    this.game = {};
  }

  init() {
    this.io.on('connection', (socket: Socket) => {
      if (this.gameRunning) {
        socket.disconnect()
        return;
      }
      this.connect(socket)
      if (this.checkStart()) this.startGame()


      socket.on('pass', (card: number) => this.passRound(socket.id, card))
      socket.on('take', ({userCard, tableCards}) => this.takeCard(socket.id, userCard, tableCards))

      socket.on('disconnect', () => this.disconnect(socket.id))
    })
  }

  takeCard(id: string, userCard: number, tableCards: number[]) {
    this.players.get(id).handCards.splice(this.players.get(id).handCards.indexOf(userCard), 1)
    this.players.get(id).takenCards.push(...[userCard, ...tableCards])

    if(this.isEscova([userCard, ...tableCards])) this.players.get(id).escobas += 1
    
    tableCards.forEach(card => {
      this.game.inTableCards.splice(this.game.inTableCards.indexOf(card), 1)
    })
    this.toPlayChange(id)
    this.emitGameState()
  }

  takeRealCardsValue(cards: number[]): Array<number> {
       const realValue =  cards.reduce((p, c) => {
            if (c <= 10) p.push(c)
            if (c > 10 && c <= 20) p.push(c - 10)
            if (c > 20 && c <=30) p.push(c - 20)
            if (c > 30 && c <= 40) p.push(c - 30)
            return p;
        },[])
      return realValue
  }

  isEscova(cards: number[]): boolean {
    const cardsSum = this.takeRealCardsValue(cards).reduce((p, c) => p + c, 0)
    if(cardsSum === 15) return true
    return false
  }

  passRound(id: string, card: number): void {
    this.players.get(id).handCards.splice(this.players.get(id).handCards.indexOf(card), 1)
    this.game.inTableCards.push(card);
    this.toPlayChange(id)
    this.emitGameState()
  }

  toPlayChange(currentPlaying: string) {
    const newPlayerToPlay = [...this.players.keys()].filter(a => a !== currentPlaying)
    this.game.toPlay = newPlayerToPlay[0]
  }

  connect(socket: Socket): void {
    this.players.set(socket.id, {})
    console.log('[CLIENT] New Client Connected')
    this.checkStart();
  }

  disconnect(id: string): void {
    this.players.delete(id);
    if (!this.checkStart()) {
      this.game = {}
      this.gameRunning = false
    }
    console.log("[CLIENT] A Client Disconnected");
  }

  startGame(): void {
    this.gameRunning = true;
    const cardsShufled = availableCards.sort(() => Math.random() - 0.5)
    const inTableCards = cardsShufled.splice(0, 4)
    const firstUserCards = cardsShufled.splice(0, 3)
    const secondUserCards = cardsShufled.splice(0, 3)

    const keys = [...this.players.keys()]

    this.players.set(keys[0], {
      escobas: 0,
      handCards: firstUserCards,
    	takenCards: []
    })

    this.players.set(keys[1], {
      escobas: 0,
      handCards: secondUserCards,
    	takenCards: []
    })

    this.game = {
      inTableCards,
      mountCards: cardsShufled,
      toPlay: keys[0],
    }

    this.emitGameState()
  }

  emitGameState(): void {
    this.io.emit('GameState', { game: this.game, players: JSON.stringify(Array.from(this.players)) })
  }

  checkStart(): boolean {
    if (this.players.size === 2) return true
    return false
  }
}

export default Game