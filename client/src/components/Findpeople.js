/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FindPeople component

function FindPeople() {
    const [users, setUsers] = useState([]);
    const [first, setFirst] = useState([]);

    useEffect(() => {
        console.log("useEffect -fetch for last users- is running once");
        fetch("/lastusers")
            .then((response) => response.json())
            .then((data) => {
                // console.log("success in fetch after getLastUSers");
                // console.log("data.results.rows: ", data.results.rows);
                setUsers(data.results.rows);
            })
            .catch((error) => {
                console.log("error on fetch after getLastUsers: ", error);
            });
    }, []);

    useEffect(() => {
        let abort;
        console.log(
            "useEffect -search people by first name- is running everytime the user does a search"
        );
        (async () => {
            try {
                const data = await fetch("/lastusersbyname", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ first }),
                }).then((response) => response.json());

                if (!abort) {
                    setUsers(data.results.rows);
                }
            } catch (error) {
                console.log(error);
            }
        })();
        return () => {
            abort = true;
        };
    }, [first]);

    return (
        <>
            <h1>Find your friends here:</h1>
            <ul>
                {users.map((item, idx) => (
                    <li key={idx}>
                        {item.first} {item.last}
                        <a href={"/username/" + item.id}>
                            <img
                                height="100px"
                                src={item.url || "./images/strawberry-user.jpg"}
                            />
                        </a>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={(e) => setFirst(e.target.value)}
            ></input>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default FindPeople;
