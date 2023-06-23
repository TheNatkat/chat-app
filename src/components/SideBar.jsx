import React, { useEffect, useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import ToastContainer from "react-bootstrap/ToastContainer";
import Channel from "./sideBarComps/Channel";
import UserInfo from "./sideBarComps/UserInfo";
import Members from "./sideBarComps/Members";
import { useDispatch, useSelector } from "react-redux";
import MyVerticallyCenteredModal from "./chatBoxComps/Model";
import {
  setRooms,
  setCurrentRoom,
  setMessages,
  setMembers,
} from "../store/ChatSlice";
import { socket } from "../services/Socket";
import {
  putUserInRoom,
  getAllMembersByRoomName,
  PostNewRoom,
  getAllRooms,
  getUserJoinRoom,
  deleteUserfromRoom,
} from "../services/axiosApi.js";

const SideBar = () => {
  const [isRoomSelected, setIsRoomSelected] = useState(true);
  const [roomDesc, setRoomDesc] = useState(
    "Here you can chat with Any user on Chit-Chat"
  );
  const user = useSelector((state) => state.user);
  const [modalShow, setModalShow] = React.useState(false);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const dispatch = useDispatch();
  const members = useSelector((state) => state.chat.members);
  const rooms = useSelector((state) => state.chat.rooms);
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const [errorArr, setErrorArr] = useState([]);

  useEffect(() => {
    dispatch(setCurrentRoom("welcome room"));
    makeRoom("welcome room", "Here you can chat with Any user on Chit-Chat");
    getRooms();
    socket.emit("join-room", "welcome room");
  }, []);

  async function addUserToRoom(userId, roomName) {
    

    if(!isRoomJoined){
      await putUserInRoom(userId, roomName)
      .then(() => {
        getAllMembers(roomName);
        socket.emit("user-join-room", roomName);
        setIsRoomJoined(true);
      })
      .catch((err) => {
        setErrorArr([
          ...errorArr,
          { errorMsg: "Network Error (Check Connection)" },
        ]);
        setTimeout(() => setErrorArr([]), 2000);
      });
    }else{
      await deleteUserfromRoom(userId, roomName)
      .then(() => {
        getAllMembers(roomName);
        socket.emit("user-join-room", roomName);
        setIsRoomJoined(false);
      })
      .catch((err) => {
        setErrorArr([
          ...errorArr,
          { errorMsg: "Network Error (Check Connection)" },
        ]);
        setTimeout(() => setErrorArr([]), 2000);
      });
    }
    
    
  }

  async function getAllMembers(roomName) {
    await getAllMembersByRoomName(roomName)
      .then((response) => {
        dispatch(setMembers(response.data.users));
      })
      .catch((error) => {
        setErrorArr([
          ...errorArr,
          { errorMsg: "Network Error (Check Connection)" },
        ]);
        setTimeout(() => setErrorArr([]), 2000);
      });
  }

  async function makeRoom(roomName, description) {
    await PostNewRoom(roomName, description)
      .then(() => {
        addUserToRoom(user.data._id, roomName);
        getRooms();
      })
      .catch((error) => {
        setErrorArr([
          ...errorArr,
          { errorMsg: "Failed to create room (TRY AGAIN)" },
        ]);
        setTimeout(() => setErrorArr([]), 2000);
      });
  }

  async function getRooms() {
    await getAllRooms()
      .then((response) => {
        dispatch(setRooms(response.data));
      })
      .catch((error) => {
        setErrorArr([
          ...errorArr,
          { errorMsg: "Network Error (Check Connection)" },
        ]);
        setTimeout(() => setErrorArr([]), 2000);
      });
  }

  async function handleExitRoom() {
    await getRooms();
    setIsRoomSelected(!isRoomSelected);
  }

  async function joinRoom(room) {
    await getUserJoinRoom(room, user)
      .then((res) => {
        res.data ? setIsRoomJoined(true) : setIsRoomJoined(false);
        socket.emit("join-room", room.name, currentRoom);
        setIsRoomSelected(!isRoomSelected);
        dispatch(setCurrentRoom(room.name));
        setRoomDesc(room.description);
        getAllMembers(room.name);
      })
      .catch((err) => {
        setErrorArr([
          ...errorArr,
          { errorMsg: "Failed while joining Room (TRY AGAIN)" },
        ]);
        setTimeout(() => setErrorArr([]), 2000);
      });
  }

  function handleSearchtext(e) {
    if (e.key === "Enter" && e.target.value !== "") {
      const result = rooms.filter((singleRoom) =>
        singleRoom.name.includes(e.target.value)
      );
      dispatch(setRooms(result));
    } else if (e.target.value.length === 1) {
      getRooms();
    }
  }

  socket.off("new-user").on("new-user", (payload) => {
    dispatch(setMembers(payload));
  });

  socket.off("refersh-members").on("refersh-members", (payload) => {
    getAllMembers(currentRoom)
  });

  socket.off("set-room-user").on("set-room-user", (payload) => {
    if (currentRoom === payload.roomName) {
      dispatch(setMembers(payload.members));
    }
  });

  socket.off("messages-updated").on("messages-updated", (payload) => {
    if (currentRoom === payload.roomName)
      dispatch(setMessages(payload.messages));
  });

  socket.off("new-channel").on("new-channel", (payload) => {
    dispatch(setRooms(payload));
  });

  return (
    <>
      <div className="chat-utilis">
        {!isRoomSelected && (
          <div className="header sidebar-header adding-channel">
            <h6 className="channel-heading">Channels</h6>
            <span onClick={() => setModalShow(true)}>
              <AiOutlinePlus className="add-channel" />
            </span>
            <MyVerticallyCenteredModal
              makeRoom={makeRoom}
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </div>
        )}
        {isRoomSelected && (
          <div className="header sidebar-header all-channel">
            <TbChevronLeft onClick={handleExitRoom} id="arrow" />
            <h6> All Channels</h6>
          </div>
        )}
        {!isRoomSelected && (
          <>
            <div className="search-container">
              <AiOutlineSearch id="search-icon" />
              <input
                id="search-bar"
                type="text"
                placeholder="Search"
                onKeyDown={(e) => handleSearchtext(e)}
              />
            </div>
            <div className="all-channels">
              {rooms.map((room) => (
                <Channel joinRoom={joinRoom} key={room._id} room={room} />
              ))}
            </div>
          </>
        )}

        {isRoomSelected && (
          <>
            <div className="channel-info">
              <h1 className="channel-name">{currentRoom}</h1>
              <p className="channel-desc">{roomDesc}</p>
            </div>
            <div className="member-heading">
              <h1 className="members-heading">Members</h1>
              <span
                onClick={() => addUserToRoom(user.data._id, currentRoom)}
                className="join-btn"
                style={
                  isRoomJoined
                    ? { borderColor: "grey" }
                    : { borderColor: "rgba(48, 129, 237)" }
                }
              >
                {isRoomJoined ? "joined" : "join"}
              </span>
            </div>

            <div className="all-members">
              {members.map((member) => {
                return (
                  <Members
                    joinRoom={joinRoom}
                    key={member._id}
                    member={member}
                  />
                );
              })}
            </div>
          </>
        )}
        <UserInfo />
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

export default SideBar;
