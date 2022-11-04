/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { FriendshipButton } from "./Friendshipbutton";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the ProfileOthers component

export function ProfileOthers() {
    const { id } = useParams();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState([]);
    const history = useHistory();

    useEffect(() => {
        setError([]);
        fetch(`/otherusersinfo/${id}`)
            .then((response) => response.json())
            .then((data) => {
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
                <div id="others">
                    <h2>
                        {users.first} {users.last}{" "}
                    </h2>
                    <img
                        height="100px"
                        src={users.url || "./images/strawberry-user.jpg"}
                    />
                    <p className="others-bio">{users.bio}</p>
                </div>
            )}
            {error && <p className="error">{error}</p>}
            <FriendshipButton />
        </>
    );
}
