import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Paho from 'paho-mqtt';

interface MqttContextType {
  client: Paho.Client | null;
  connect: () => void;
  disconnect: () => void;
  connectionStatus: string;
  messages: string[];
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  topic: string;
}

interface MqttProviderProps {
  children: ReactNode; 
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }
  return context;
};

export const MqttProvider: React.FC<MqttProviderProps> = ({ children }) => {
  const [client, setClient] = useState<Paho.Client | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [topic, setTopic] = useState('sensor/#');

  useEffect(() => {
    // Initialize the client only once when the component mounts
    const clientID = `clientID-${Math.floor(Math.random() * 100)}`;
    const mqttClient = new Paho.Client('ws://192.168.18.172:9001/mqtt', clientID);

    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;

    setClient(mqttClient);
  }, []);

  const connect = () => {
    if (client && connectionStatus !== 'Connected') {
      const options = {
        useSSL: false,
        userName: 'mqttbroker',
        password: 'mqttbroker123',
        onSuccess: onConnect,
        onFailure: (error: any) => {
          console.error('Connection failed:', error);
          setConnectionStatus('Connection Failed');
        },
      };
      client.connect(options);
    }
  };

  const onConnect = () => {
    setConnectionStatus('Connected');
    // If connected, subscribe to the topic
    if (client) {
      client.subscribe(topic);
    }
  };

  const onConnectionLost = (responseObject: Paho.MQTTError) => {
    if (responseObject.errorCode !== 0) {
      console.error('Connection Lost:', responseObject.errorMessage);
    }
    setConnectionStatus('Disconnected');
  };

  const onMessageArrived = (message: Paho.Message) => {
    setMessages((prevMessages) => [...prevMessages, message.payloadString]);
  };

  const disconnect = () => {
    if (client) {
      client.disconnect();
      setConnectionStatus('Disconnected');
    }
  };

  return (
    <MqttContext.Provider
      value={{ client, connect, disconnect, connectionStatus, messages, setTopic, topic }}
    >
      {children}
    </MqttContext.Provider>
  );
};
