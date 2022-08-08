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
            <ProfilePic
                firstName={firstName}
                lastName={lastName}
                userId={userId}
                picture={picture}
                bio={bio}
                toggleModal={toggleModal}
            />
            <h2>
                Hello {firstName} {lastName}
            </h2>
            <img
                onClick={toggleModal}
                src={picture || "./images/strawberry-user.jpg"}
                height="300px"
                alt={firstName + " " + lastName}
            ></img>
            {/* try with the "this" inside the {} if it does not work */}
            <BioEditor saveDraftBio={saveDraftBio} bio={bio} />
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Profile;
