import React from "react";
import { IconContext } from "react-icons";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

const generateInitials = (name) => {
  
  const words = name.split(" ");
  if (words.length === 1) {
    return name.charAt(0);
  } else {
    return words[0].charAt(0) + words[words.length - 1].charAt(0);
  }
};

const Channel = ({ joinRoom, room }) => {
  const initials = generateInitials(room.name).toUpperCase();
  const currentRoom = useSelector(state => state.chat.currentRoom);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div
      className={
        currentRoom.toLowerCase() === room.name.toLowerCase()
          ? "Channel-selected"
          : "Channel"
      }
      onClick={() => joinRoom(room)}
      active={room.name == currentRoom ? "true" : "false"}
    >
      <IconContext.Provider value={{ size: "1.5em" }}>
        {initials ? (
          <div className="channels-container">
            <div className="channel-icon">{initials}</div>
            <h5>{capitalizeFirstLetter(room.name)}</h5>
          </div>
        ) : (
          <FaUser />
        )}
      </IconContext.Provider>
    </div>
  );
};

export default Channel;
