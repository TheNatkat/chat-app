import api from "./api";

export async function putUserInRoom(userId, roomName) {
  return await api.put("/rooms/adduser", {
    userId: userId,
    roomName: roomName,
  });
}

export async function getAllMembersByRoomName(roomName) {
  return await api.get(`/rooms/getusers/${roomName}`);
}

export async function PostNewRoom(roomName, description) {
  return await api.post("/createroom", {
    roomName,
    description,
  });
}

export async function getAllRooms() {
  return await api.get("/rooms");
}

export async function getUserJoinRoom(room, user) {
  return await api.get(`/rooms/checkuser/${room.name}/${user.data._id}`);
}

export async function postEmojiOnMessage(e, message, user, currentRoom) {
  return await api.post("/addemoji", {
    userId: user.data._id,
    emojiId: e.id,
    messageId: message._id,
    currentRoom: currentRoom,
  });
}

export async function deleteAMessage(messageId, currentRoom) {
  return await api.delete(`/delete/${currentRoom}`, {
    data: { messageId },
  });
}

export async function deleteUserfromRoom(userId, roomName) {
  console.log(userId, roomName)
  return await api.delete(`/rooms/removeuser/${roomName}/${userId}`);
}