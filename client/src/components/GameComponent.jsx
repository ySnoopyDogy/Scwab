import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function ClientComponent() {
  const [response, setResponse] = useState("");
  
  useEffect(() => {
    const socket = io(process.env.REACT_APP_WEBSOCKET_URI);
    socket.on("cards", data => {
      setResponse(data);
    });

    socket.on("game-full", (msg) => {
      setResponse(msg);
    });

    return () => socket.disconnect();

  }, []);

  return (
    <div className="text-center">
      <p>{response}</p>
    </div>
  );
}