/* eslint-disable no-unused-vars */

// this is our mini-reducer that is specific to "messages"
// when the action-creators underneath run, they will talk to this reducer automatically
// there is one if-statement for each action-creator

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MINI REDUCER

function messagesReducer(messages = [], action) {
    // Reducer for RECEIVING MESSAGES
    if (action.type == "messages/receive") {
        messages = action.payload;
        //console.log("messages/receive, messages:", messages);
    }

    // Reducer for SAVING A MESSAGE
    if (action.type === "message/save") {
        messages = [...messages].unshift();
        //console.log("message/save, messages:", messages);
    }

    return messages;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ACTION CREATORS

// we pass messages as a parameter (coming from the server via chat.js)
// functions are exported to be used in chat.js

// Action Creator for RECEIVING MESSAGES
export function receiveMessages(messages) {
    //console.log("receiveMessages, messages:", messages);
    return {
        type: "messages/receive",
        payload: { messages },
    };
}

// Action Creator for SAVING A MESSAGE
export function saveMessage(message) {
    //console.log("saveMessage, message:", message);
    return { type: "message/save", payload: { message } };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default messagesReducer;
