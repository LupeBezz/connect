/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Profile Pic component

export function ProfilePic({
    firstName,
    lastName,
    userId,
    picture,
    toggleModal,
}) {
    return (
        <>
            <div id="profile-pic">
                <img
                    src={picture || "./images/her.jpg"}
                    height="100px"
                    alt={firstName + " " + lastName}
                ></img>
                <div>
                    <h2>{firstName}</h2>
                </div>
            </div>
        </>
    );
}
