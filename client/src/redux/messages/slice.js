/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MINI REDUCER
// there is one reducer for each action-creator below
// reducer exported only for reducer.js

export function messagesReducer(messages = [], action) {
    if (action.type == "messages/receive") {
        messages = action.payload;
    }

    if (action.type === "message/save") {
        messages = [action.payload, ...messages];
    }
    return messages;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ACTION CREATORS
// functions are exported to be used in socket.js (via Chat.js)

// Action Creator for RECEIVING MESSAGES
export function receiveMessages(lastMessages) {
    return {
        type: "messages/receive",
        payload: lastMessages,
    };
}

// Action Creator for SAVING A MESSAGE
export function saveMessage(message) {
    return { type: "message/save", payload: message };
}
