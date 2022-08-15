/* eslint-disable no-unused-vars */

// this is our mini-reducer that is specific to "friends"
// when the action-creators underneath run, they will talk to this reducer automatically
// there is one if-statement for each action-creator

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MINI REDUCER

function friendsAndWannabesReducer(friends = [], action) {
    // Reducer for RECEIVE
    // TO DO: split up the data depending if friendship is accepted or not
    if (action.type == "friends-and-wannabes/receive") {
        friends = action.payload.friends;
    }

    //Reducer for ACCEPT
    // we have an array of friends in global state
    // we want to loop through it, find the one with the same id, then accept friendship (set accepted to true)
    // we need to do all of this INMUTABLY - no direct mutation! - use MAP

    if (action.type == "friends-and-wannabes/accept") {
        friends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return { ...friend, accepted: true };
            } else {
                return friend;
            }
        });
    }

    //Reducer for UNFRIEND
    // we have an array of friends in global state
    // we want to loop through it, find the one with the same id, then unfriend (set accepted to false)
    // we need to do all of this INMUTABLY - no direct mutation! - use MAP

    if (action.type === "friends-and-wannabes/unfriend") {
        friends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return { ...friend, accepted: false };
            } else {
                return friend;
            }
        });
    }

    // if (friends.length === 0) {
    //     return (friends = null);
    // }

    return friends;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ACTION CREATORS

// we pass friends as a parameter (coming from the server via FriendsAndWannabes.js)
// functions are exported to be used in FriendsAndWannabes.js

// Action Creator for RECEIVE
export function receiveFriendsAndWannabes(friends) {
    console.log("friends in action", friends);

    return {
        type: "friends-and-wannabes/receive",
        payload: { friends },
    };
}

// Action Creator for ACCEPT
export function acceptFriend(id) {
    return { type: "friends-and-wannabes/accept", payload: { id } };
}

// Action Creator for UNFRIEND
export function unfriend(id) {
    return { type: "friends-and-wannabes/unfriend", payload: { id } };
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default friendsAndWannabesReducer;
