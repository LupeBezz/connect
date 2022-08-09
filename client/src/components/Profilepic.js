/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile Pic component

function ProfilePic({ firstName, lastName, userId, picture, toggleModal }) {
    return (
        <>
            <div id="profile-pic">
                <img
                    onClick={toggleModal}
                    src={picture || "./images/strawberry-user.jpg"}
                    height="100px"
                    alt={firstName + " " + lastName}
                ></img>
                <div>
                    <p>Welcome</p>
                    <p>
                        {firstName} {lastName}
                    </p>
                </div>
            </div>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ProfilePic;
