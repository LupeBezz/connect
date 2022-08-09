/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import ProfilePic from "./Profilepic";
import BioEditor from "./Bioeditor";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile component

function Profile({
    firstName,
    lastName,
    userId,
    picture,
    bio,
    toggleModal,
    saveDraftBio,
}) {
    return (
        <>
            {/* <ProfilePic
                firstName={firstName}
                lastName={lastName}
                userId={userId}
                picture={picture}
                bio={bio}
                toggleModal={toggleModal}
            /> */}

            <img
                onClick={toggleModal}
                src={picture || "./images/strawberry-user.jpg"}
                height="300px"
                alt={firstName + " " + lastName}
            ></img>

            <BioEditor saveDraftBio={saveDraftBio} bio={bio} />
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Profile;
