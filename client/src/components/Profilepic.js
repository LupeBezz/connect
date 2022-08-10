/* eslint-disable no-unused-vars */

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
                    <h2>{firstName}</h2>
                </div>
            </div>
            <img
                id="main-image"
                src="./images/44030.jpg"
                height="400px"
                alt="seniors"
            />
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ProfilePic;
