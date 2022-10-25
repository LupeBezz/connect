/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";

import {
    acceptFriend,
    rejectFriend,
    unfriend,
    receiveFriendsAndWannabes,
} from "../redux/friends/slice.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FriendsAndWannabes component

export function FriendsAndWannabes() {
    const [displayFriends, setDisplayFriends] = useState(true);
    const [displayWannabes, setDisplayWannabes] = useState(false);

    const dispatch = useDispatch();

    // here we get the information from redux global state
    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );

    // USE EFFECT RUNS ONCE TO GET ALL FRIENDS AND WANNABES //

    useEffect(() => {
        (async () => {
            const res = await fetch("/friends-and-wannabes");
            const data = await res.json();

            // DISPATCH - this line starts the proccess of adding info to Redux
            // to dispatch we pass an action creator (function that returns an action)
            // receiveFriendsAndWannabes is imported from another file (slice.js) in redux/friends
            dispatch(receiveFriendsAndWannabes(data));
        })();
    }, []);

    // while we wait for the fetch above...
    if (!friends) {
        return null;
    }

    // function ACCEPT FRIEND //

    const handleAcceptFriend = async (id) => {
        const res = await fetch(`/friendship/accept/${id}`, {
            method: "POST",
        });
        const data = await res.json();

        if (data) {
            //now we want to update this info to the global state: dispatch > action creator
            dispatch(acceptFriend(id));
        }
    };

    // function REJECT FRIEND //

    const handleRejectFriend = async (id) => {
        try {
            const res = await fetch(`/friendship/delete/${id}`, {
                method: "POST",
            });
            const data = await res.json();

            if (data) {
                //now we want to update this info to the global state: dispatch > action creator
                dispatch(rejectFriend(id));
            }
        } catch (err) {
            console.log("error after rejectFriend: ", err);
        }
    };

    // function UNFRIEND //

    const handleUnfriend = async (id) => {
        const res = await fetch(`/friendship/delete/${id}`, {
            method: "POST",
        });
        const data = await res.json();

        if (data) {
            //now we want to update this info to the global state: dispatch > action creator
            dispatch(unfriend(id));
        }
    };

    const showFriends = () => {
        setDisplayFriends(true);
        setDisplayWannabes(false);
    };

    const showWannabes = () => {
        setDisplayWannabes(true);
        setDisplayFriends(false);
    };

    return (
        <>
            <button
                className={
                    displayFriends === true
                        ? "button-active"
                        : "button-inactive"
                }
                id="button-friends"
                onClick={showFriends}
            >
                Friends
            </button>
            <button
                className={
                    displayWannabes === true
                        ? "button-active"
                        : "button-inactive"
                }
                id="button-requests"
                onClick={showWannabes}
            >
                Requests
            </button>
            <p id="scroll">↓ Scroll for more ↓</p>

            {displayFriends && (
                <div>
                    <h2 className="list-title">
                        These people are your current friends
                    </h2>
                    <div id="list-background">
                        <div id="list-friends">
                            {friends.map((friend) => {
                                return (
                                    <div key={friend.id}>
                                        <Link to={"/username/" + friend.id}>
                                            <img
                                                height="100px"
                                                src={friend.url}
                                            />
                                        </Link>
                                        <div>
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
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {displayWannabes && (
                <div>
                    <h2 className="list-title">
                        These people sent you a friendship request
                    </h2>
                    <div id="list-wannabes-background">
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
                                        <div>
                                            <p>
                                                {wannabe.first} {wannabe.last}
                                            </p>
                                            <div id="list-wannabes-buttons">
                                                <button
                                                    onClick={() =>
                                                        handleAcceptFriend(
                                                            wannabe.id
                                                        )
                                                    }
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRejectFriend(
                                                            wannabe.id
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
