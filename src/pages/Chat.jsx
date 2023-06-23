import React from "react";
import SideBar from "../components/SideBar";
import ChatBox from "../components/ChatBox";

const Chat = () => {
  return (
    <div className="chat">
      <SideBar />
      <ChatBox />
    </div>
  );
};

export default Chat;
