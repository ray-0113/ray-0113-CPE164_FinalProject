import React, { useEffect } from 'react';
import { useMqtt } from '@/Components/MQTT/mqtt-context';

const MqttConnect: React.FC = () => {
  const { client, connect, disconnect, connectionStatus, setTopic, topic } = useMqtt();

  useEffect(() => {
    // Connect to the broker if the client exists and it's not connected
    if (client && connectionStatus === 'Disconnected') {
      connect(); 
    }
  }, [client, connectionStatus, connect]);

  const handleConnect = () => {
    // Only try to connect if the client is not already connected
    if (connectionStatus !== 'Connected') {
      connect();
    }
  };

  const handleDisconnect = () => {
    // Disconnect only if the client is connected
    if (connectionStatus === 'Connected') {
      disconnect();
    }
  };

  return (
    <div className="mqtt-wrapper">
      <h1>MQTT Connection</h1>
      <p>Status: {connectionStatus}</p>
      <div>
        <label>
          <b>Topic:</b>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Topic"
          />
        </label>
      </div>
      <div>
        {/* Connect Button */}
        <button
          className="mb-2"
          onClick={handleConnect}
          disabled={connectionStatus === 'Connected'}
        >
          Connect
        </button>
        
        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          disabled={connectionStatus !== 'Connected'}
        >
          Disconnect
        </button>
      </div>

      {/* Uncomment to display messages */}
      {/* <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default MqttConnect;
