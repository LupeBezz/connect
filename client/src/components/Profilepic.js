/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile Pic component

function ProfilePic({ firstName, lastName, userId, picture, toggleModal }) {
    return (
        <>
            <img
                id="profilePic"
                onClick={toggleModal}
                src={picture || "./images/strawberry-user.jpg"}
                height="100px"
                alt={firstName + " " + lastName}
            ></img>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ProfilePic;
