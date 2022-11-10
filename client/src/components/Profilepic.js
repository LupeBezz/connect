/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile Pic component

export function ProfilePic({ firstName, lastName, picture }) {
    return (
        <>
            <div id="profile-pic">
                <img
                    src={picture || "../images/her.jpg"}
                    height="100px"
                    alt={firstName + " " + lastName}
                ></img>

                <h2>{firstName}</h2>
            </div>
        </>
    );
}
