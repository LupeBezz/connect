/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { io } from "socket.io-client";

import { receiveMessages, saveMessage } from "./redux/messages/slice.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - socket io

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        // chatMessages action dispatched > an array containing 10 chat messages should be present in the global state object
        socket.on("chatMessages", (lastMessages) => {
            store.dispatch(receiveMessages(lastMessages));
        });

        // chatNewMessage action dispatched > the global state object's array of messages should be replaced with a new array
        // that contains all of the message that were in the old array plus the new one
        socket.on("add-chatNewMessage", (message) => {
            store.dispatch(saveMessage(message));
        });
    }
};
