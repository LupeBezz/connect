/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
    acceptFriend,
    rejectFriend,
    unfriend,
    receiveFriendsAndWannabes,
} from "../redux/friends/slice.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FriendsAndWannabes component

export function FriendsAndWannabes() {
    const [displayPeople, setDisplayPeople] = useState("friends");

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - here we get the information from redux global state
    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get the FriendsAndWannabes info > happens only once

    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            // we get the info from the server
            const res = await fetch("/friends-and-wannabes");
            const data = await res.json();

            // and send it to the global state, sending the fetched data as payload
            dispatch(receiveFriendsAndWannabes(data));
        })();
    }, []);

    // while we wait for the fetch above...
    if (!friends) {
        return null;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - accept friend

    const handleAcceptFriend = async (id) => {
        // we do it in the server
        const res = await fetch(`/friendship/accept/${id}`, {
            method: "POST",
        });
        const data = await res.json();

        // and we update the info to the global state, sending id as payload
        if (data) {
            dispatch(acceptFriend(id));
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - reject friend

    const handleRejectFriend = async (id) => {
        // we do it in the server
        try {
            const res = await fetch(`/friendship/delete/${id}`, {
                method: "POST",
            });
            const data = await res.json();

            // and we update the info to the global state, sending id as payload
            if (data) {
                dispatch(rejectFriend(id));
            }
        } catch (err) {
            console.log("error after rejectFriend: ", err);
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - unfriend

    const handleUnfriend = async (id) => {
        // we do it in the server
        const res = await fetch(`/friendship/delete/${id}`, {
            method: "POST",
        });
        const data = await res.json();

        // and we update the info to the global state, sending id as payload
        if (data) {
            dispatch(unfriend(id));
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - other functions

    const showFriends = () => {
        setDisplayPeople("friends");
    };

    const showWannabes = () => {
        setDisplayPeople("wannabes");
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - return

    return (
        <>
            <button
                className={
                    displayPeople === "friends"
                        ? "subtab-active"
                        : "subtab-inactive"
                }
                id="subtab-friends"
                onClick={showFriends}
            >
                Friends
            </button>
            <button
                className={
                    displayPeople === "wannabes"
                        ? "subtab-active"
                        : "subtab-inactive"
                }
                id="subtab-requests"
                onClick={showWannabes}
            >
                Requests
            </button>

            <h2 className="list-title">
                These people
                {displayPeople === "friends"
                    ? " are your current friends"
                    : " want to be your friends"}
            </h2>
            <p id="scroll">↓ Scroll for more ↓</p>

            <div className="list-background">
                {displayPeople === "friends" && (
                    <div id="list-friends">
                        {friends.map((friend) => {
                            return (
                                <div key={friend.id}>
                                    <Link to={"/username/" + friend.id}>
                                        <img
                                            height="100px"
                                            src={
                                                friend.url || "./images/her.jpg"
                                            }
                                        />
                                    </Link>

                                    <p>
                                        {friend.first} {friend.last}
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleUnfriend(friend.id)
                                        }
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {displayPeople === "wannabes" && (
                    <div id="list-wannabes">
                        {wannabes.map((wannabe) => {
                            return (
                                <div key={wannabe.id}>
                                    <Link to={"/username/" + wannabe.id}>
                                        <img
                                            src={
                                                wannabe.url ||
                                                "./images/her.jpg"
                                            }
                                        />
                                    </Link>
                                    <p>
                                        {wannabe.first} {wannabe.last}
                                    </p>
                                    <button
                                        onClick={() =>
                                            handleAcceptFriend(wannabe.id)
                                        }
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRejectFriend(wannabe.id)
                                        }
                                    >
                                        Reject
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
