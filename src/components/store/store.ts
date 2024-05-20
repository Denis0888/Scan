import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import publicationsReducer from "./searcPublicationsSlice";

const rootReducer = combineReducers({
    user: userReducer,
    publications: publicationsReducer,
  });

export const store = configureStore({ 
    reducer: rootReducer
 });
