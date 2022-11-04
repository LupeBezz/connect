/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FriendshipButton component

export function FriendshipButton() {
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
            setHasRequest(false);
            setAccepted(false);
            setIsMyRequest(false);
        } else {
            setHasRequest(true);
            if (info[0].accepted == true) {
                setAccepted(true);
            }
            if (info[0].receiver_id == id) {
                setIsMyRequest(true);
            }
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - useEffect that checks once when the page loads
    useEffect(() => {
        fetch(`/friendship/check/${id}`)
            .then((response) => response.json())
            .then((data) => {
                let info = data.results.rows;
                checkData(info);
            })
            .catch((error) => {
                console.log("error on fetch after checkFriendship: ", error);
            });
    }, []);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - useEffect that checks automatically everytime the states changes
    useEffect(() => {
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
        fetch(`/friendship/request/${id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
                let info = data.results.rows;
                checkData(info);
            })
            .catch((error) => {
                console.log("error on fetch after requestFriendship: ", error);
            });
    }

    function acceptFriendship() {
        fetch(`/friendship/accept/${id}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((data) => {
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
                id="others-button"
                type="button"
                name="friendship"
                onClick={buttonState.buttonCallback}
            >
                {buttonState.buttonLabel}
            </button>
        </>
    );
}
