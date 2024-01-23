import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // Ajusta la URL de tu servidor

function App() {
  const [socket, setSocket] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const socketConnection = io(SERVER_URL);

    const handleConnect = () => {
      console.log('Conectado al servidor Socket.IO');
    };

    const handleDisconnect = () => {
      console.log('Desconectado del servidor Socket.IO');
    };

    const handleMqttMessage = (message) => {
      console.log("hadleMqttMessage", message)
      setReceivedMessage(message);
    };

    const handleError = (error) => {
      console.error('Error en la conexión del socket:', error);
    };

    socketConnection.on('connect', handleConnect);
    socketConnection.on('disconnect', handleDisconnect);
    socketConnection.on('error', handleError);
    socketConnection.on('messageFromReactWeb', handleMqttMessage);

    setSocket(socketConnection);

    return () => {
      if (socketConnection.connected) {
        socketConnection.disconnect();
      }
      setSocket(null);
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      const message = 'Mensaje desde el cliente de react';
      socket.emit('messageFromReactWeb', message);
      console.log(`Mensaje enviado al servidor: ${message}`);
    }
  };

  return (
    <div className="App">
      <h1>React con Socket.IO</h1>
      <p>Último mensaje recibido: {receivedMessage}</p>
      <button onClick={sendMessage}>Enviar Mensaje</button>
    </div>
  );
}

export default App;
