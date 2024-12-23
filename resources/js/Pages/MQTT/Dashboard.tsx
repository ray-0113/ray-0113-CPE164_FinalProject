import React, { useState, useEffect } from "react";
import MainDashboard from "@/Pages/MQTT/MainDashboard";
import { LineChartComponent } from "@/Components/line-chart";
import { TemperatureChartComponent } from "@/Components/radial-chart-temp";
import { HumidityChartComponent } from "@/Components/radial-chart-humid";
import { useMqtt } from "@/Components/MQTT/mqtt-context";
import MqttConnect from '@/Components/MQTT/mqtt-connect';

export default function Dashboard() {
    const {
        client,
        connect,
        disconnect,
        connectionStatus,
        messages,
        setTopic,
        topic,
    } = useMqtt();
    const [temperature, setTemperature] = useState<number>(0);
    const [humidity, setHumidity] = useState<number>(0);

    useEffect(() => {
        if (client && connectionStatus === "Connected") {
            client.subscribe("sensor/temperature");
            client.subscribe("sensor/humidity");

            client.onMessageArrived = onMessageArrived;
        } else if (connectionStatus !== "Connected") {
            connect(); 
        }
    }, [client, connectionStatus, connect]); 

    const onMessageArrived = (message: Paho.MQTT.Message) => {
        const topic = message.destinationName;
        const payload = parseFloat(message.payloadString);

        if (!isNaN(payload)) {
            if (topic === "sensor/temperature") {
                setTemperature(payload);
            } else if (topic === "sensor/humidity") {
                setHumidity(payload);
            }
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* <MqttConnect/> */}
            <div className="">
                <LineChartComponent />
            </div>
            
            <div className="">
                <div className="mb-3">
                    <p className="text-center text-2xl font-semibold leading-none tracking-tight">
                        Live Temperature & Humidity Monitoring
                    </p>
                </div>
                <div className="mb-5">
                    <TemperatureChartComponent temperature={temperature} />
                </div>

                <div>
                    <HumidityChartComponent humidity={humidity} />
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <MainDashboard>{page}</MainDashboard>
);
