/* eslint-disable no-unused-vars */

// exported only for start.js

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Imports

import { combineReducers } from "redux";
import { friendsAndWannabesReducer } from "./friends/slice";
import { messagesReducer } from "./messages/slice";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - combine Reducers

export const rootReducer = combineReducers({
    friends: friendsAndWannabesReducer,
    messages: messagesReducer,
});
