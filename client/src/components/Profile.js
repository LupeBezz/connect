/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { BioEditor } from "./Bioeditor";
import { Uploader } from "./Uploader";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile component

export function Profile({
    firstName,
    lastName,
    picture,
    bio,
    saveDraftBio,
    uploadPicture,
    uploaderMessage,
}) {
    return (
        <>
            <img
                className="editor-image"
                src={picture || "./images/her.jpg"}
                height="300px"
                alt={firstName + " " + lastName}
            ></img>

            <Uploader
                uploadPicture={uploadPicture}
                uploaderMessage={uploaderMessage}
            />
            <BioEditor saveDraftBio={saveDraftBio} bio={bio} />
        </>
    );
}
