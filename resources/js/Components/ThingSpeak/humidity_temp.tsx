import React from "react";

const HumidityTempThingSpeakComponent: React.FC = () => {
  const iframeStyles = "w-full h-64 border border-gray-300 rounded-md shadow-sm";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <iframe
        className={iframeStyles}
        src="https://thingspeak.mathworks.com/channels/2774561/charts/1??title=TEMPERATURE&type=spline&color=FF0000&width=900&xaxis=Time%20(minutes)&yaxis=TEMPERATURE%20*C&dynamic=true&results=80&title=Temperature&type=line&update=15"
        title="Temperature Chart"
      ></iframe>
      <iframe
        className={iframeStyles}
        src="https://thingspeak.mathworks.com/channels/2774561/charts/2??title=TEMPERATURE&type=spline&color=155202&width=900&xaxis=Time%20(minutes)&yaxis=HUMIDITY%20&dynamic=true&results=80&title=Humidity&type=line&update=15"
        title="Humidity Chart"
      ></iframe>
    </div>
  );
};

export default HumidityTempThingSpeakComponent;