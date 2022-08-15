/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports
function friendsAndWannabesReducer(friends = [], action) {
    if (action.type === "friends-and-wannabes/received") {
        return action.payload.friends;
    } else if (action.type === "friends-and-wannabes/accept") {
        // check action.payload.id
        const newFriends = friends.map();
        return newFriends;
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default friendsAndWannabesReducer;
