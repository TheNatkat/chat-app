import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineAddReaction } from "react-icons/md";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { init } from "emoji-mart";

init({ data });

const Message = ({ message, handleDeleteMessage, handleAddEmoji }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEmojiSelected, setIsEmojiSelected] = useState(false);
  const user = useSelector((state) => state.user);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const style = {
    backgroundColor: isHovered ? "rgba(0, 0, 0, 0.09)" : "initial",
  };

  const emojiCount = message.reactions.reduce((acc, item) => {
    if (acc[item.emojiId]) {
      acc[item.emojiId] += 1;
    } else {
      acc[item.emojiId] = 1;
    }
    return acc;
  }, {});

  return (
    <div
      className="message"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <div className="message-options-container">
        {isHovered && (
          <div className="message-options">
            {isEmojiSelected && (
              <Picker
                data={data}
                onEmojiSelect={(e) => handleAddEmoji(e, message)}
              />
            )}
            {user.data._id === message.user._id && !isEmojiSelected && (
              <AiFillDelete
                id="delete-icon"
                onClick={() => handleDeleteMessage(message._id)}
              />
            )}
            <MdOutlineAddReaction
              id="addreaction-icon"
              onClick={() => setIsEmojiSelected(!isEmojiSelected)}
            />
          </div>
        )}
      </div>
      <div className="message-inner">
        <div className="chat-box-img">
          <img src={message.user?.picture} className="avatar-user" />
        </div>
        <div className="chat-box-text">
          <div className="chat-box-upper">
            <p className="message-sender">
              {message?.user._id === user?.data._id ? "you" : message.user.name}
            </p>
            <p className="message-timestamp">{message?.time}</p>
          </div>
          <p className="message-content">{message?.content}</p>
          {message.image !== "none" && (
            <img className="chatbox-img" src={message.image} />
          )}
        </div>
      </div>
      <div className="emojis-container">
        {Object.entries(emojiCount).map((emoji) => {
          return (
            <span key={emoji[0]} className="emoji-box">
              <em-emoji id={emoji[0]} /> {emoji[1]}
            </span>
          );
        })}
      </div>
    </div>
    
  );
};

export default Message;
