import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    currentRoom: "welcome room",
    messages: [],
    members: [],
  },
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export const {
  setRooms,
  setCurrentRoom,
  setMessages,
  setMembers,
} = chatSlice.actions;
export default chatSlice.reducer;
