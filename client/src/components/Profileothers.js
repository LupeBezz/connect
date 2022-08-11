/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import FriendshipButton from "./Friendshipbutton";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the ProfileOthers component

function ProfileOthers() {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState([]);
    const history = useHistory();

    //console.log("id: ", id);

    useEffect(() => {
        //console.log("useEffect -profile others- is running once");
        setError([]);
        fetch(`/otherusersinfo/${id}`)
            .then((response) => response.json())
            .then((data) => {
                //console.log("success in fetch after getUserInfoFromId");
                //console.log("data: ", data);
                //console.log("data.results.rows: ", data.results.rows);
                //console.log("data.self: ", data.self);
                if (data.self === true) {
                    setError("No results");
                    history.push("/");
                } else {
                    if (data.results.rows.length > 0) {
                        setUsers(data.results.rows[0]);
                    } else {
                        setError("No results");
                    }
                }
            })
            .catch((error) => {
                console.log("error on fetch after getUserInfoFromId: ", error);

                return;
            });
    }, [id]);

    return (
        <>
            {error.length === 0 && (
                <div>
                    <h1>profile others</h1>
                    <h2>
                        {users.first} {users.last}{" "}
                    </h2>
                    <img
                        height="100px"
                        src={users.url || "./images/strawberry-user.jpg"}
                    />
                    <p>{users.bio}</p>
                </div>
            )}
            {error && <p className="error">{error}</p>}
            <FriendshipButton />
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default ProfileOthers;
