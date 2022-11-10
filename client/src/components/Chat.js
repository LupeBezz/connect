/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { socket } from "../socket";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Chat component

export function Chat() {
    // here we get the information from redux global state
    const messages = useSelector((state) => state.messages);

    // while we wait for the fetch above...
    if (!messages) {
        return null;
    }

    // When the user hits the enter key or presses a "send" button, a 'chatNewMessage' event should be emitted
    // it will be received in socket.js and the new message will be sent from there to Redux (via dispatch)
    // it will also be received in server.js to store the message in the database

    const textareaRef = useRef();

    const handleSaveMessage = () => {
        const message = textareaRef.current.value;
        socket.emit("chatNewMessage", { message });
        textareaRef.current.value = "";
        textareaRef.current.focus();
    };

    const onChange = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            handleSaveMessage();
        }
    };

    // helper function to parse Data

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
                                        src={
                                            message.url ||
                                            message.messagePicture ||
                                            "./images/her.jpg"
                                        }
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
