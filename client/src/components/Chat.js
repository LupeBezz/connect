/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";

import { socket } from "../socket";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Chat component

export function Chat() {
    // here we get the information from redux global state

    const dispatch = useDispatch();

    const messages = useSelector((state) => state.messages);
    console.log("chat.js > messages in state: ", messages);

    // useEffect(() => {
    //     console.log("chat.js > useEffect: ", messages);
    //     (async () => {
    //         const res = await fetch("/chat/last-ten-messages");
    //         const data = await res.json();
    //         // DISPATCH - this line starts the proccess of adding info to Redux
    //         // to dispatch we pass an action creator (function that returns an action)
    //         // receiveMessages is imported from another file (slice.js) in redux/messages
    //         dispatch(receiveMessages(data));
    //     })();
    // }, []);

    // while we wait for the fetch above...
    if (!messages) {
        return null;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function SAVE MESSAGE //

    // In most chat UIs a newly received message will be added to the bottom of the display area and then automatically scrolled into view.
    // This effect can be achieved in CSS using flex-direction: column-reverse. To do it with Javascript you can set the scrollTop of the element every time you add a new message.
    // However, to do this you need access to the element and normally in React we do not act directly on HTML elements.
    // Fortunately, React does provide a way to gain access to specific DOM elements for the rare occasions such as this when it becomes necessary: refs.
    // If you are writing a function component, you can import and use the useRef hook.
    // You can then access the DOM element in your code using the current property of the ref.
    // If you are writing a function component, you would set elemRef.current.scrollTop in a function passed to useEffect.

    // When the user hits the enter key in this <textarea> or presses a "send" button, a 'chatNewMessage' event should be emitted.

    const textareaRef = useRef();

    const handleSaveMessage = () => {
        const message = textareaRef.current.value;
        //message comes from state
        socket.emit("chatNewMessage", { message });
        textareaRef.current.value = "";
        textareaRef.current.focus();
    };

    const onChange = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            handleSaveMessage();
        }
    };

    const parseDate = (timestamp) => {
        let parsedDate =
            timestamp.slice(8, 10) +
            "/" +
            timestamp.slice(5, 7) +
            "/" +
            timestamp.slice(0, 4) +
            ", " +
            timestamp.slice(11, 16);
        return parsedDate;
    };

    return (
        <>
            <div id="chat">
                <div id="chat-display">
                    {messages.map((message) => {
                        var parsedTimestamp = parseDate(message.timestamp);
                        return (
                            <div id="chat-message" key={Math.random()}>
                                <Link to={"/username/" + message.id}>
                                    <img
                                        src={message.url || "./images/her.jpg"}
                                    ></img>
                                </Link>
                                <div id="chat-message-text">
                                    <h4>{message.text}</h4>
                                    <p>
                                        {message.first || "you"} {message.last}{" "}
                                        - {parsedTimestamp}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div id="chat-send">
                    <textarea
                        ref={textareaRef}
                        placeholder="write your message here"
                        onKeyUp={onChange}
                    ></textarea>

                    <button
                        id="chat-button"
                        onClick={() => handleSaveMessage()}
                    >
                        send
                    </button>
                </div>
            </div>
            <img
                id="main-image-kids"
                src="/images/440300.jpg"
                height="400px"
                alt="kids"
            />
        </>
    );
}
