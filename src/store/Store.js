import { configureStore, combineReducers } from "@reduxjs/toolkit";
import homeSliceReducer from "./HomeSlice";
import appApi from "../services/appApi";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";
import chatSliceReducer from "./ChatSlice";

const reducer = combineReducers({
  home: homeSliceReducer,
  user: userReducer,
  chat: chatSliceReducer ,
  [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [appApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware],
});

export default store;
