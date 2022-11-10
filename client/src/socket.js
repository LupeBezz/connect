/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { io } from "socket.io-client";

import { receiveMessages, saveMessage } from "./redux/messages/slice.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - socket io

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        // emited on server.js > an array containing the last 10 messages in the database should be uploaded to the global state object
        socket.on("chatMessages", (lastMessages) => {
            store.dispatch(receiveMessages(lastMessages));
        });

        // emited on server.js > the new message should be added to the the global state object's array of messages
        socket.on("add-chatNewMessage", (message) => {
            store.dispatch(saveMessage(message));
        });
    }
};
