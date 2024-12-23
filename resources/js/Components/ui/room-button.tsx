import React from "react";
import "/resources/css/button.css";

interface RoomToggleButtonProps {
    roomName: string;
    checked: boolean;
    onChange: (room: string, state: boolean) => void;
}

const RoomToggleButton: React.FC<RoomToggleButtonProps> = ({
    roomName,
    checked,
    onChange,
}) => {
    return (
        <div className="wrapper">
            <input
                type="checkbox"
                id={roomName}
                checked={checked}
                onChange={() => onChange(roomName, !checked)}
            />
        </div>
    );
};

export default RoomToggleButton;
