/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MINI REDUCER
// there is one reducer for each action-creator below
// reducer exported only for reducer.js

export function friendsAndWannabesReducer(friends = [], action) {
    // Reducer for RECEIVE
    if (action.type == "friends-and-wannabes/receive") {
        friends = action.payload.friends;
    }

    // Reducer for ACCEPT
    // we have an array of friends in global state. We want to loop through it, find the one with the same id, then accept friendship (accepted: true)

    if (action.type === "friends-and-wannabes/accept") {
        friends = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return { ...friend, accepted: true };
            } else {
                return friend;
            }
        });
    }

    // Reducer for REJECT
    // we have an array of friends in global state. We want to loop through it, find the one with the same id, then reject friendship (erase line)

    if (action.type === "friends-and-wannabes/reject") {
        friends = friends.filter((friend) => friend.id !== action.payload.id);
    }

    // Reducer for UNFRIEND
    // we have an array of friends in global state. We want to loop through it, find the one with the same id, then unfriend (accepted: false)

    if (action.type === "friends-and-wannabes/unfriend") {
        friends = friends.map((friend) => {
            if (friend.id == action.payload.id) {
                return { ...friend, accepted: false };
            } else {
                return friend;
            }
        });
    }

    // For all reducers above
    return friends;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ACTION CREATORS
// functions are exported to be used in FriendsAndWannabes.js > the payload comes from there

// Action Creator for RECEIVE
export function receiveFriendsAndWannabes(friends) {
    return {
        type: "friends-and-wannabes/receive",
        payload: { friends },
    };
}

// Action Creator for ACCEPT
export function acceptFriend(id) {
    return { type: "friends-and-wannabes/accept", payload: { id } };
}

// Action Creator for REJECT
export function rejectFriend(id) {
    return { type: "friends-and-wannabes/reject", payload: { id } };
}

// Action Creator for UNFRIEND
export function unfriend(id) {
    return { type: "friends-and-wannabes/unfriend", payload: { id } };
}
