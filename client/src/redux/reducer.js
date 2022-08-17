/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Imports

import { combineReducers } from "redux";
import friendsAndWannabesReducer from "./friends/slice";
import messagesReducer from "./messages/slice";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - combine Reducers

const rootReducer = combineReducers({
    friends: friendsAndWannabesReducer,
    messages: messagesReducer,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default rootReducer;
