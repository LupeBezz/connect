/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { BioEditor } from "./Bioeditor";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile component

export function Profile({ firstName, lastName, picture, bio, saveDraftBio }) {
    return (
        <>
            <img
                className="editor-image"
                src={picture || "./images/her.jpg"}
                height="300px"
                alt={firstName + " " + lastName}
            ></img>

            <BioEditor saveDraftBio={saveDraftBio} bio={bio} />
        </>
    );
}
