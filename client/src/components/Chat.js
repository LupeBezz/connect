/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";
import { socket } from "../socket";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import { receiveMessages, saveMessage } from "../redux/messages/slice.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Chat component

function Chat() {
    const dispatch = useDispatch();

    // here we get the information from redux global state
    const messages = useSelector((state) => state.messages);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - USE EFFECT RUNS ONCE TO GET ALL FRIENDS AND WANNABES //

    useEffect(() => {
        //console.log("messages inside useEffect: ", messages);
        // (async () => {
        //     //console.log("inside async");
        //     const res = await fetch("/chat/last-ten-messages");
        //     const data = await res.json();
        //     // DISPATCH - this line starts the proccess of adding info to Redux
        //     // to dispatch we pass an action creator (function that returns an action)
        //     // receiveMessages is imported from another file (slice.js) in redux/messages
        //     dispatch(receiveMessages(data));
        // })();
    }, []);

    // while we wait for the fetch above...
    if (!messages) {
        return null;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function ACCEPT FRIEND //

    const handleSaveMessage = async () => {
        const message = "test message for now";
        console.log("handleSaveMessage: ", message);
        //message comes from state
        socket.emit("chatNewMessage", { message });
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function CHAT INPUT //

    // In most chat UIs a newly received message will be added to the bottom of the display area and then automatically scrolled into view.
    // This effect can be achieved in CSS using flex-direction: column-reverse. To do it with Javascript you can set the scrollTop of the element every time you add a new message.
    // However, to do this you need access to the element and normally in React we do not act directly on HTML elements.
    // Fortunately, React does provide a way to gain access to specific DOM elements for the rare occasions such as this when it becomes necessary: refs.
    // If you are writing a function component, you can import and use the useRef hook.
    // You can then access the DOM element in your code using the current property of the ref.
    // If you are writing a function component, you would set elemRef.current.scrollTop in a function passed to useEffect.
    const textareaRef = useRef();

    // When the user hits the enter key in this <textarea> or presses a "send" button, a 'chatNewMessage' event should be emitted.

    const sendMessage = () => {
        const message = textareaRef.current.value;
        // or should this be add-chatNewMessage?
        socket.emit("chatNewMessage", {
            // username: "username",
            text: message,
        });
        textareaRef.current.value = "";
        textareaRef.current.focus();
    };

    const onChange = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            sendMessage();
        }
    };

    return (
        <>
            <h1>Chat</h1>
            <textarea
                ref={textareaRef}
                placeholder="write your message here"
                onKeyUp={onChange}
            ></textarea>

            <button
                id="chat-button"
                onClick={() => handleSaveMessage()}
                /* here comes the value of the textarea */
            >
                send
            </button>
        </>
    );
    // return (
    //     <>
    //         <h1>Chat</h1>

    //         <div id="chat-display">
    //             {messages.map((message) => {
    //                 return (
    //                     <div key={Math.random()}>
    //                         <p>{message.text}</p>
    //                         <p>
    //                             {/* here comes first name + last name of the author + posting date */}
    //                         </p>
    //                     </div>
    //                 );
    //             })}
    //         </div>

    // <textarea
    //     ref={textareaRef}
    //     placeholder="write your message here"
    //     onKeyUp={onChange}
    // ></textarea>

    // <button
    //     id="chat-button"
    //     onClick={() => handleSaveMessage()}
    //     /* here comes the value of the textarea */
    // >
    //     send
    // </button>

    //         <img
    //             id="main-image-kids"
    //             src="/images/440300.jpg"
    //             height="400px"
    //             alt="kids"
    //         />
    //     </>
    // );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Chat;
