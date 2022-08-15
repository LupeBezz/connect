/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import {
    acceptFriend,
    receiveFriendsAndWannabes,
} from "../redux/friends/slice";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FriendsAndWannabes component

function FriendsAndWannabes() {
    const dispatch = useDispatch();

    const wannabes = useSelector((state) => {
        state.friends && state.friends.filter((friend) => !friend.accepted);
    });

    const friends = useSelector((state) => {
        state.friends && state.friends.filter((friend) => friend.accepted);
    });

    return <></>;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default FriendsAndWannabes;
