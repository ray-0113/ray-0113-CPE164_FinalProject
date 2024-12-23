import React from "react";

const GasThingSpeakComponent: React.FC = () => {
  const iframeStyles = "w-1/2 h-64 border border-gray-300 rounded-md shadow-sm";

  return (
    <div className="flex justify-center">
      <iframe
        className={iframeStyles}
        src="https://thingspeak.mathworks.com/channels/2774561/charts/3??title=GAS&type=spline&color=FF0000&width=900&xaxis=Time%20(minutes)&yaxis=GAS%20&dynamic=true&results=80&title=Gas+Level&type=line&update=15"
        title="Gas Level Chart"
      ></iframe>
    </div>
  );
};

export default GasThingSpeakComponent;