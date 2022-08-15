/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import { combineReducers } from "redux";
import friendsAndWannabesReducer from "./friends/slice";
// you need to import your friendsWannabesReducer here!

const rootReducer = combineReducers({
    friends: friendsAndWannabesReducer,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default rootReducer;
