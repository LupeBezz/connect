/* eslint-disable no-unused-vars */

// this is our mini-reducer that is specific to "messages"
// when the action-creators underneath run, they will talk to this reducer automatically
// there is one if-statement for each action-creator

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MINI REDUCER

function messagesReducer(messages = [], action) {
    // Reducer for RECEIVING MESSAGES
    if (action.type == "messages/receive") {
        messages = action.payload;
    }

    // Reducer for SAVING A MESSAGE
    if (action.type === "message/save") {
        messages = [action.payload, ...messages];
    }
    return messages;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ACTION CREATORS

// we pass messages as a parameter (coming from the server via chat.js)
// functions are exported to be used in chat.js

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default messagesReducer;
