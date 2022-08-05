/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile Pic component
//we will receive props from the parent component (app.js) and use them here
// imgFromApp = imgFromApp || "/default.jpg" > if the user hasn't uploaded a picture yet
// then we place the above code in the img

function ProfilePic({ firstName, lastName, userId, picture, toggleModal }) {
    return (
        <>
            <img
                onClick={toggleModal}
                src={picture || "./images/strawberry-user.jpg"}
                height="200px"
                alt={firstName + " " + lastName}
            ></img>
        </>
    );
}

// OR ALSO LIKE THIS, WITHOUT DESTRUCTURING THE PROPS:
// function ProfilePic(props) {
//     return <>My name is {props.name}</>;
// }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ProfilePic;
