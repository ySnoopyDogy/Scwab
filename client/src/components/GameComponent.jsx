import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function GameComponent() {
  const [GameState, setGameState] = useState({});
  const [cardToSend, setCardToSend] = useState()
  const [isPlaying, setIsPlaying] = useState(false)
  const Socket = useRef()

  const sendCartFora = (carta) => {
    const userCards = GameState.players.get(Socket.current.id).handCards
    if(userCards.includes(carta)) {
      Socket.current.emit("pass", carta)
    }
  }
  
  useEffect(async () => {
    Socket.current = io(process.env.REACT_APP_WEBSOCKET_URI)
    Socket.current.on("GameState", data => {
      data.game.toPlay === Socket.current.id ? setIsPlaying(true) : setIsPlaying(false)
      setGameState({game: data.game, players: new Map(JSON.parse(data.players))});
    });

    return () => Socket.current.disconnect();

  }, []);

  return (
    <div className="text-center">
      <div className="self-center bg-red-500">
      <p>
        Cartas Na mesa
      </p>
      <p>{GameState?.game?.inTableCards.join(", ")}</p>
      </div>
      <div className="bg-blue-400">
        <p>Sua Mão</p>
        <p>{GameState?.players?.get(Socket.current.id)?.handCards?.join(", ")}</p>
      </div>
      <div>
       <button className={isPlaying ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" : "bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"} disabled={!isPlaying} onClick={() => sendCartFora(cardToSend)}>JogarCartaFora</button>
       <input placeholder="carta" onChange={a => setCardToSend(parseInt(a.target.value))} className="shadow appearance-none border rounded ml-8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
    </div>
  );
}