/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FindPeople component

function FindPeople(isFindPeopleOpen) {
    const [users, setUsers] = useState([]);
    const [first, setFirst] = useState([]);

    useEffect(() => {
        isFindPeopleOpen = true;
        //console.log("useEffect -fetch for last users- is running once");
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
            {/* <h1>Find your friends here:</h1> */}
            <ul id="people-info">
                {users.map((item, idx) => (
                    <li key={idx}>
                        <a href={"/username/" + item.id}>
                            <img
                                height="100px"
                                src={item.url || "./images/strawberry-user.jpg"}
                            />
                        </a>
                        {item.first} {item.last}
                    </li>
                ))}
            </ul>
            <div id="people-search">
                <p>Who are you looking for?</p>
                <input
                    type="text"
                    name="firstName"
                    placeholder="type here name"
                    onChange={(e) => setFirst(e.target.value)}
                ></input>
            </div>
        </>
    );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default FindPeople;
