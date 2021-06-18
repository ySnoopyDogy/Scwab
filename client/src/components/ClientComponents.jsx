import React, { useEffect, useState } from "react";
import io from "socket.io-client";

export default function ClientComponent() {
  const [response, setResponse] = useState("");
  
  useEffect(() => {
    const socket = io(process.env.REACT_APP_WEBSOCKET_URI);
    socket.on("FromAPI", data => {
      setResponse(data);
    });

    return () => socket.disconnect();

  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}