/* eslint-disable no-unused-vars */

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
            <img
                // onClick={toggleModal}
                className="editor-image"
                src={picture || "./images/her.jpg"}
                height="300px"
                alt={firstName + " " + lastName}
            ></img>

            <BioEditor saveDraftBio={saveDraftBio} bio={bio} />
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Profile;
