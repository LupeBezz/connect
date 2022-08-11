/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FriendshipButton component

function FriendshipButton() {
    const { id } = useParams();
    const [hasRequest, setHasRequest] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [isMyRequest, setIsMyRequest] = useState(false);
    const [buttonState, setButtonState] = useState({
        buttonLabel: "default",
        buttonCallback: null,
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function to check states after every fetch
    function checkData(info) {
        if (info.length == 0) {
            console.log("no friendship requested");
            setHasRequest(false);
            setAccepted(false);
            setIsMyRequest(false);
        } else {
            console.log("friendship requested");
            setHasRequest(true);
            if (info[0].accepted == true) {
                console.log("friendship accepted");
                setAccepted(true);
            }
            if (info[0].receiver_id == id) {
                console.log("friendship started by me");
                setIsMyRequest(true);
            }
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - useEffect that checks once when the page loads
    useEffect(() => {
        //console.log("useEffect is running once to get friendship info");
        fetch(`/friendship/check/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("success in fetch after getLastUSers");
                console.log("data: ", data);
                let info = data.results.rows;
                checkData(info);
            })
            .catch((error) => {
                console.log("error on fetch after checkFriendship: ", error);
            });
    }, []);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - useEffect that checks automatically everytime the states changes
    useEffect(() => {
        console.log("useEffect is updating buttonState on every change");
        if (hasRequest == false) {
            setButtonState({
                buttonLabel: "request Friendship",
                buttonCallback: requestFriendship,
            });
        } else {
            if (accepted == true) {
                setButtonState({
                    buttonLabel: "end Friendship",
                    buttonCallback: deleteFriendship,
                });
            } else {
                if (isMyRequest == true) {
                    setButtonState({
                        buttonLabel: "cancel request",
                        buttonCallback: deleteFriendship,
                    });
                } else {
                    setButtonState({
                        buttonLabel: "accept Friendship",
                        buttonCallback: acceptFriendship,
                    });
                }
            }
        }
    }, [hasRequest, accepted, isMyRequest]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - diverse functions to fetch

    function requestFriendship() {
        console.log("reached requestFriendship");

        fetch(`/friendship/request/${id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("success in fetch after getLastUSers");
                console.log("data: ", data);
                let info = data.results.rows;
                checkData(info);
            })
            .catch((error) => {
                console.log("error on fetch after requestFriendship: ", error);
            });
    }

    function acceptFriendship() {
        console.log("reached acceptFriendship");

        fetch(`/friendship/accept/${id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("success in fetch after getLastUSers");
                console.log("data: ", data);
                let info = data.results.rows;
                checkData(info);
            })
            .catch((error) => {
                console.log("error on fetch after acceptFriendship: ", error);
            });
    }

    function deleteFriendship() {
        console.log("reached deleteFriendship");
        fetch(`/friendship/delete/${id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("success in fetch after getLastUSers");
                console.log("data: ", data);
                let info = data.results.rows;
                checkData(info);
            })
            .catch((error) => {
                console.log("error on fetch after deleteFriendship: ", error);
            });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - return

    return (
        <>
            <button
                type="button"
                name="friendship"
                onClick={buttonState.buttonCallback}
            >
                {buttonState.buttonLabel}
            </button>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default FriendshipButton;
