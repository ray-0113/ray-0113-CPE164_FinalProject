import React, { useState, useEffect } from "react";
import Paho from "paho-mqtt";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import image from "/Images/image.png";
import { TemperatureChartComponent } from "@/Components/radial-chart-temp";
import { HumidityChartComponent } from "@/Components/radial-chart-humid";
import { useToast } from "@/hooks/use-toast";
import {
    ChartNoAxesCombined,
    Joystick,
    PersonStanding,
    SunSnow,
} from "lucide-react";
import RoomToggleButton from "../ui/room-button";
import HumidityTempThingSpeakComponent from "../ThingSpeak/humidity_temp";
import { GasChartComponent } from "../radial-chart-gas";
import GasThingSpeakComponent from "../ThingSpeak/gas";

export default function ProjectDashboard() {
    const { toast } = useToast();
    const [client, setClient] = useState<Paho.Client | null>(null);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [topic, setTopic] = useState("sensor/#");
    const [host, setHost] = useState("192.168.18.172");
    const [port, setPort] = useState("9001");

    //humidity and temperature
    const [temperature, setTemperature] = useState<number>(0);
    const [humidity, setHumidity] = useState<number>(0);
    const [gas, setGas] = useState<number>(0);

    //motion sensor control
    const [isActive, setIsActive] = useState<boolean>(false);

    // Room control states
    type RoomState = {
        [key: string]: boolean;
    };

    const [roomState, setRoomState] = useState<RoomState>({
        livingroom: false,
        gamingroom: false,
        bedroom: false,
        garage: false,
    });

    const [onTime, setOnTime] = useState<string>("");
    const [offTime, setOffTime] = useState<string>("");

    useEffect(() => {
        // Initialize the client once when the component mounts
        const clientID = `clientID-${Math.floor(Math.random() * 100)}`;
        const mqttClient = new Paho.Client(host, Number(port), clientID);

        mqttClient.onConnectionLost = onConnectionLost;
        mqttClient.onMessageArrived = onMessageArrived;
        setClient(mqttClient);

        // Cleanup function to disconnect the client on component unmount
        return () => {
            if (mqttClient.isConnected()) {
                mqttClient.disconnect();
            }
        };
    }, [host, port]);

    const connect = () => {
        if (client && connectionStatus !== "Connected") {
            const options = {
                useSSL: false,
                userName: "mqttbroker",
                password: "mqttbroker123",
                onSuccess: onConnect,
                onFailure: (error: any) => {
                    console.error("Connection failed:", error);
                    setConnectionStatus("Connection Failed");
                },
            };
            client.connect(options);
        }
    };

    const onConnect = () => {
        toast({
            title: "Successully Connected!",
        });
        setConnectionStatus("Connected");
        if (client) {
            client.subscribe(topic);
            client.subscribe("sensor/control");
            client.subscribe("sensor/temperature");
            client.subscribe("sensor/humidity");
            client.subscribe("sensor/gas");
        }
    };

    const onConnectionLost = (responseObject: Paho.MQTTError) => {
        if (responseObject.errorCode !== 0) {
            console.error("Connection Lost:", responseObject.errorMessage);
        }
        setConnectionStatus("Disconnected");
        toast({
            title: "Connection Disconnected!",
            variant: "destructive",
        });
        setTemperature(0);
        setHumidity(0);
        setGas(0);
    };

    const onMessageArrived = (message: Paho.Message) => {
        const topic = message.destinationName;
        const payload = parseFloat(message.payloadString);

        if (!isNaN(payload)) {
            if (topic === "sensor/temperature") {
                setTemperature(payload);
            } else if (topic === "sensor/humidity") {
                setHumidity(payload);
            } else if (topic === "sensor/gas") {
                setGas(payload);
            } else if (topic === "sensor/control") {
                setIsActive(payload === 1);
                
                if (payload === 1) {
                    toast({
                        title: "Motion Detected!",
                        description: "A motion event has been detected.",
                        variant: "destructive",
                    });
                }
            }
        }
    };

    const disconnect = () => {
        if (client) {
            client.disconnect();
            setConnectionStatus("Disconnected");

            // Reset sensors when disconnected
            setTemperature(0);
            setHumidity(0);
            setGas(0);
        }
    };

    // Toggle room state and send MQTT message
    const toggleRoom = (room: string) => {
        setRoomState((prevState) => {
            const newState = !prevState[room];
            const status = newState ? "ON" : "OFF";
            publishMsg(`test/topic${roomToTopic(room)}`, status);
            return { ...prevState, [room]: newState };
        });
    };

    const toggleDevice = () => {
        if (connectionStatus === "Connected") {
            setIsActive((prevState) => {
                const newState = !prevState;
                publishMsg("sensor/control", newState ? "ON" : "OFF");
                return newState;
            });
        } else {
            toast({
                title: "Please connect first.",
                variant: "destructive",
            });
        }
    };

    

    const roomToTopic = (room: string) => {
        switch (room) {
            case "bedroom":
                return 1;
            case "gamingroom":
                return 2;
            case "garage":
                return 3;
            case "livingroom":
                return 4;
            default:
                return 0;
        }
    };

    const publishMsg = (topic: string, message: string) => {
        if (client && client.isConnected()) {
            const mqttMessage = new Paho.Message(message);
            mqttMessage.destinationName = topic;
            client.send(mqttMessage);
        }
    };

    const toggleAllRooms = (state: boolean) => {
        const status = state ? "ON" : "OFF";
        setRoomState((prevState) => {
            const newStates = Object.keys(prevState).reduce(
                (acc, room) => ({ ...acc, [room]: state }),
                {}
            );
            Object.keys(prevState).forEach((room) => {
                publishMsg(`test/topic${roomToTopic(room)}`, status);
            });
            return newStates;
        });
    };

    const resetTime = () => {
        setOnTime("");
        setOffTime("");
    };

    const checkTime = () => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        if (currentTime === onTime) {
            toggleAllRooms(true);
        } else if (currentTime === offTime) {
            toggleAllRooms(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkTime, 1000);
        return () => clearInterval(interval);
    }, [onTime, offTime]);

    return (
        <div className="flex flex-col items-center p-8 min-h-screen">
            <h1 className="text-3xl font-semibold text-center mb-4">
                Master Bry's 2 Storey House
            </h1>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
                        <form
                            id="connection-information-form"
                            className="text-center"
                        >
                            <div className="mb-4">
                                <div className="text-center mb-6 mt-5">
                                    <p className="text-lg font-mono">Status:</p>
                                    <p
                                        id="connection"
                                        className={`text-xl font-bold ${
                                            connectionStatus === "Connected"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {connectionStatus}
                                    </p>
                                </div>

                                <label
                                    htmlFor="host"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    IP Address:
                                </label>
                                <Input
                                    id="host"
                                    type="text"
                                    name="host"
                                    value={host}
                                    onChange={(e) => setHost(e.target.value)}
                                    placeholder="Enter IP Address"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="port"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Port:
                                </label>
                                <Input
                                    id="port"
                                    type="text"
                                    name="port"
                                    value={port}
                                    onChange={(e) => setPort(e.target.value)}
                                    placeholder="Enter Port"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="topic"
                                    className="block text-sm font-semibold mb-2"
                                >
                                    Topic:
                                </label>
                                <Input
                                    id="topic"
                                    type="text"
                                    name="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end mb-5">
                                <Button
                                    type="button"
                                    className="bg-green-500 mr-5 py-2 rounded-lg hover:bg-green-600 transition"
                                    onClick={connect}
                                >
                                    Connect
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-red-500 py-2 rounded-lg hover:bg-red-600 transition"
                                    onClick={disconnect}
                                >
                                    Disconnect
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="aspect-video rounded-xl bg-muted/50">
                        <p className="text-center text-2xl font-semibold leading-none tracking-tight flex justify-center items-center mt-8">
                            Control Panel
                            <Joystick className="ml-2" />
                        </p>
                        <h1 className="mt-5 text-center">Master Switch</h1>
                        <div className="flex justify-center mt-2 gap-2">
                            <Button
                                onClick={() =>
                                    connectionStatus === "Connected"
                                        ? toggleAllRooms(true)
                                        : toast({
                                              title: "Please connect first.",
                                              variant: "destructive",
                                          })
                                }
                                disabled={connectionStatus !== "Connected"}
                            >
                                ON
                            </Button>
                            <Button
                                onClick={() =>
                                    connectionStatus === "Connected"
                                        ? toggleAllRooms(false)
                                        : toast({
                                              title: "Please connect first.",
                                              variant: "destructive",
                                          })
                                }
                                disabled={connectionStatus !== "Connected"}
                                variant="destructive"
                            >
                                OFF
                            </Button>
                        </div>

                        {/* Time Control */}
                        <div className="flex items-center justify-center gap-4 mt-8 mb-10">
                            <input
                                type="time"
                                value={onTime}
                                onChange={(e) => setOnTime(e.target.value)}
                                placeholder="On Time"
                                className="text-black"
                            />
                            <input
                                type="time"
                                value={offTime}
                                onChange={(e) => setOffTime(e.target.value)}
                                placeholder="Off Time"
                                className="text-black"
                            />
                            <Button onClick={resetTime}>Reset</Button>
                        </div>

                        {/* Rooms */}
                        <div className="grid grid-cols-4 gap-2 mb-7">
                            {Object.keys(roomState).map((room) => (
                                <div
                                    key={room}
                                    className="flex flex-col items-center"
                                >
                                    <h3 className="text-lg font-medium mb-2">
                                        {room.charAt(0).toUpperCase() +
                                            room
                                                .slice(1)
                                                .replace("room", " Room")}
                                    </h3>
                                    <RoomToggleButton
                                        key={room}
                                        roomName={room}
                                        checked={roomState[room]}
                                        onChange={(room) => {
                                            if (
                                                connectionStatus === "Connected"
                                            ) {
                                                toggleRoom(room);
                                            } else {
                                                toast({
                                                    title: "Please connect first.",
                                                    variant: "destructive",
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* motion sensor */}
                    <div className="aspect-video rounded-xl bg-muted/50">
                        <p className="text-center text-2xl font-semibold leading-none tracking-tight flex justify-center items-center mt-8">
                            Motion Sensor Controller
                            <PersonStanding className="ml-2" />
                        </p>

                        <div className="flex items-center justify-center space-x-3 mt-5">
                            <div
                                className={`relative w-20 h-10 rounded-full cursor-pointer transition-colors ${
                                    isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                                onClick={toggleDevice}
                            >
                                <div
                                    className={`absolute top-1.5 left-1 w-7 h-7 rounded-full bg-white transition-transform ${
                                        isActive
                                            ? "translate-x-10"
                                            : "translate-x-1"
                                    }`}
                                />
                            </div>

                            <span
                                className={`text-xl font-medium ${
                                    isActive ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {isActive
                                    ? "Motion Sensor Enabled"
                                    : "Motion Sensor Disabled"}
                            </span>
                        </div>

                        <div className="flex justify-center mt-2 mb-5">
                            <div
                                className={`w-36 h-auto overflow-hidden rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? "shadow-md shadow-green-500/50"
                                        : "shadow-none"
                                }`}
                            >
                                <img
                                    src={image}
                                    alt="House Image"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="mt-10 mb-5">
                        <p className="text-center text-2xl font-semibold leading-none tracking-tight flex justify-center items-center">
                            Live Temperature & Humidity & Gas Monitoring
                            <SunSnow className="ml-2" />
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-5 mb-5 px-5">
                        <div>
                            <TemperatureChartComponent
                                temperature={temperature}
                            />
                        </div>

                        <div>
                            <HumidityChartComponent humidity={humidity} />
                        </div>

                        <div>
                            <GasChartComponent gasLevel={gas} />
                        </div>
                    </div>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <div className="mt-10">
                        <p className="text-center text-2xl font-semibold leading-none tracking-tight flex justify-center items-center">
                            Data Chart of Sensors
                            <ChartNoAxesCombined className="ml-2" />
                        </p>
                    </div>

                    <div className="w-full max-w-8xl">
                        <HumidityTempThingSpeakComponent />
                    </div>

                    <div className="w-full max-w-8xl">
                        <GasThingSpeakComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}
