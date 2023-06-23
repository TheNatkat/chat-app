import React, { useEffect, useRef, useState } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { AiOutlineFileAdd, AiFillFileAdd } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../services/Socket";
import Message from "./chatBoxComps/Message";
import { setMessages } from "../store/ChatSlice";
import { deleteAMessage, getUserJoinRoom, postEmojiOnMessage } from "../services/axiosApi";
import Error from "./Error";
import ToastContainer from "react-bootstrap/ToastContainer";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const messageEndRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const dispatch = useDispatch();
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const messages = useSelector((state) => state.chat.messages);
  const [errorArr, setErrorArr] = useState([]);
 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  }

  async function uploadImage(image) {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "chatapp");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dbcabuowa/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urldata = await res.json();
      return urldata.url;
    } catch (error) {
      setErrorArr([...errorArr, { errorMsg: "Image upload failed (TRY AGAIN)" }]);
      setTimeout(() => setErrorArr([]), 2000);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (uploadedImage !== null || message !== "") {
      let url;
      if (uploadedImage !== null) {
        setloading(true);
        url = await uploadImage(uploadedImage);
        setloading(false);
      }
      const todayDate = getFormattedDate();
      const today = new Date();
      const minutes =
        today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
      const time = today.getHours() + ":" + minutes;
      const room = currentRoom;
      const checkuser = await getUserJoinRoom({ name: room}, user);
      console.log(checkuser)
      if(!checkuser.data) {
        setErrorArr([...errorArr, { errorMsg: "Please join group to send message" }]);
        setTimeout(() => setErrorArr([]), 2000);
        return;
      }
      socket.emit(
        "message-room",
        room,
        message,
        url,
        user.data._id,
        time,
        todayDate
      );
      setUploadedImage(null);
      setMessage("");
    }
  }

  async function handleAddEmoji(e, message) {
    await postEmojiOnMessage(e, message, user, currentRoom).catch((err) => {
      setErrorArr([...errorArr, { errorMsg: "Failed to add emoji (TRY AGAIN)" }]);
      setTimeout(() => setErrorArr([]), 2000);
    });
  }

  function handleSubmitMessage(e) {
    setMessage(e.target.value);
    if (e.key === "Enter") {
      e.target.value = "";
      handleSubmit(e);
    }
  }

  function setImg(e) {
    let file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  }
  socket.off("room-messages").on("room-messages", (roomMessages) => {
    dispatch(setMessages(roomMessages));
  });

  async function handleDeleteMessage(messageId) {
    deleteAMessage(messageId, currentRoom).catch((err) => {
      setErrorArr([...errorArr, { errorMsg: "Failed to delete message (TRY AGAIN)" }]);
      setTimeout(() => setErrorArr([]), 2000);
    });
  }

  return (
    <>
      <div className="chat-area">
        <div className="header chatbox-header">
          <h6>{currentRoom}</h6>
        </div>
        <div className="chat-input-box">
          <div className="chat-box">
            <div className="chat-box-element">
              <div className="chat-box-date-container">
                <hr className="line" />
                <p className="chat-box-date">{messages[0]?.date}</p>
                <hr className="line" />
              </div>
              {messages?.map((message, idx) => (
                <Message
                  handleAddEmoji={handleAddEmoji}
                  handleDeleteMessage={handleDeleteMessage}
                  message={message}
                  key={message?._id}
                 
                />
              ))}
            </div>
            <div ref={messageEndRef} />
          </div>

          <input
            placeholder="Type your message here"
            id="chat-input"
            onChange={handleSubmitMessage}
            onKeyDown={(e) => handleSubmitMessage(e)}
          />

          {!loading ? (
            <>
              <label htmlFor="img-upload" className="chatbox-icon file">
                {uploadedImage === null ? (
                  <AiOutlineFileAdd className="icon file" />
                ) : (
                  <AiFillFileAdd className="icon file" />
                )}
              </label>
              <input
                type="file"
                id="img-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={setImg}
              />
            </>
          ) : (
            <label htmlFor="img-upload" className="chatbox-icon file spinner">
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            </label>
          )}
          <span className="chatbox-icon" onClick={handleSubmit}>
            <HiOutlinePaperAirplane className="icon" />
          </span>
        </div>
      </div>
      <ToastContainer
        className="p-3"
        position="top-center"
        style={{ zIndex: 100 }}
      >
        {errorArr.map((errorItem, idx) => (
          <Error key={idx} errorMsg={errorItem.errorMsg} />
        ))}
      </ToastContainer>
    </>
  );
};

export default ChatBox;
