/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports
import { io } from "socket.io-client";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports

import { receiveMessages, saveMessage } from "./redux/messages/slice.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - socket io

// this file takes care of the connection with redux

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        console.log("inside init");

        socket.on("chatMessages", (lastMessages) => {
            console.log("socket.js > chatMessages ", lastMessages);
            store.dispatch(receiveMessages(lastMessages));
        });

        socket.on("add-chatNewMessage", (message) => {
            console.log("socket.js > add-chatNewMessage: ", message);
            store.dispatch(saveMessage(message));
        });

        // In the code above, the two event handlers dispatch corresponding actions.
        // - As a result of the chatMessages action being dispatched, an array containing 10 chat messages should be present in the global state object.
        // - As a result of the chatNewMessage action being dispatched, the global state object's array of messages should be replaced with a new array
        //   that contains all of the message that were in the old array plus one more.
    }
};
