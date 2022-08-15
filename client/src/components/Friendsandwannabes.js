/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import {
    acceptFriend,
    unfriend,
    receiveFriendsAndWannabes,
} from "../redux/friends/slice";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FriendsAndWannabes component

function FriendsAndWannabes() {
    const [displayFriends, setDisplayFriends] = useState(true);
    const [displayWannabes, setDisplayWannabes] = useState(false);

    const dispatch = useDispatch();

    // here we get the information from redux global state, depending if the friendships is accepted (friends) or not (only a request: wannabes)
    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - USE EFFECT RUNS ONCE TO GET ALL FRIENDS AND WANNABES //

    useEffect(() => {
        console.log("friends inside useEffect: ", friends);
        // if (!friends) {
        (async () => {
            console.log("inside async");
            const res = await fetch("/friends-and-wannabes");
            const data = await res.json();
            console.log("data after getFriendsAndWannabes: ", data);

            // DISPATCH - this line starts the proccess of adding info to Redux
            // to dispatch we pass an action creator (function that returns an action)
            // receiveFriendsAndWannabes is imported from another file (slice.js) in redux/friends
            dispatch(receiveFriendsAndWannabes(data));
        })();
        // }
    }, []);

    if (!friends) {
        return null;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function ACCEPT FRIEND //

    const acceptFriend = async (id) => {
        console.log("acceptFriend, id: ", id);
        const res = await fetch(`/friendship/accept/${id}`, {
            method: "POST",
        });
        const data = await res.json();
        console.log(`data from /friendship/accept/${id}`, data);

        if (data) {
            //now we want to update this info to the global state: dispatch > action creator
            dispatch(acceptFriend(id));
        }
    };

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function UNFRIEND //

    const unfriend = async (id) => {
        console.log("unfriend, id: ", id);
        const res = await fetch(`/friendship/delete/${id}`, {
            method: "POST",
        });
        const data = await res.json();
        console.log(`data from /friendship/delete/${id}`, data);

        if (data) {
            //now we want to update this info to the global state: dispatch > action creator
            dispatch(unfriend(id));
        }
    };

    const showFriends = () => {
        setDisplayFriends(true);
        setDisplayWannabes(false);
        console.log("displayFriends: ", displayFriends);
        console.log("displayWannabes: ", displayWannabes);
    };

    const showWannabes = () => {
        setDisplayWannabes(true);
        setDisplayFriends(false);
        console.log("displayFriends: ", displayFriends);
        console.log("displayWannabes: ", displayWannabes);
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

            {displayFriends && (
                <div>
                    <h2 className="list-title">
                        These people are your current friends
                    </h2>
                    <div id="list-friends">
                        {friends.map((friend) => {
                            return (
                                <div key={friend.id}>
                                    <Link to={"/username/" + friend.id}>
                                        <img height="100px" src={friend.url} />
                                    </Link>
                                    <div id="list-friends-info">
                                        <p>
                                            {friend.first} {friend.last}
                                        </p>
                                        <button
                                            onClick={() => {
                                                unfriend(friend.id);
                                            }}
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {displayWannabes && (
                <div>
                    <h2 className="list-title">
                        These people sent you a friendship request
                    </h2>
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
                                    <div id="list-wannabes-info">
                                        <p>
                                            {wannabe.first} {wannabe.last}
                                        </p>
                                        <button
                                            onClick={() => {
                                                acceptFriend(wannabe.id);
                                            }}
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default FriendsAndWannabes;
