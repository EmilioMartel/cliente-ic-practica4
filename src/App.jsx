import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import placaImage from './assets/placa.webp';
import './App.css'

const SERVER_URL = 'http://localhost:3000'; // Ajusta la URL de tu servidor

function App() {
  const [dataArray, setDataArray] = useState([]); // Nuevo estado para almacenar el array de objetos JSON

  useEffect(() => {
    const socketConnection = io(SERVER_URL);

    const handleConnect = () => {
      console.log('Conectado al servidor Socket.IO');
    };

    const handleDisconnect = () => {
      console.log('Desconectado del servidor Socket.IO');
    };

    const handleMqttMessage = (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        setDataArray(parsedMessage)
      } catch (error) {
        console.error('Error al parsear el mensaje como objeto JSON:', error);
      }
    }

    const handleError = (error) => {
      console.error('Error en la conexión del socket:', error);
    };

    socketConnection.on('connect', handleConnect);
    socketConnection.on('disconnect', handleDisconnect);
    socketConnection.on('error', handleError);
    socketConnection.on('messageFromReactWeb', handleMqttMessage);

    return () => {
      if (socketConnection.connected) {
        socketConnection.disconnect();
      }
    };
  }, [dataArray]);


  return (
    <div className="App">
      <h1>Gestor de Residuos</h1>

      {/* Genera dinámicamente las tarjetas según el tamaño del array */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {dataArray.map((item) => (
          <div key={item.id} className="col">
            <div className="card">
              {/* Puedes ajustar la lógica para cargar imágenes según los datos del array */}
              <img src={placaImage} className="card-img-top" alt="Card Image" />
              <div className="card-body">
              <h5 className="card-title">{item.name}</h5>                
                <p className="card-text">Status: {(item.status) ? '✅' : '🚩'} </p>
                <p className="card-text">Capacidad: {item.capacidad}</p>
                <p className="card-text">Coordenadas: {item.coordenadas}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;