/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the FindPeople component

function FindPeople(isFindPeopleOpen) {
    const [lastUsers, setLastUsers] = useState([]);
    const [usersByName, setUsersByName] = useState([]);
    const [first, setFirst] = useState("");

    useEffect(() => {
        isFindPeopleOpen = true;
        //console.log("useEffect -fetch for last users- is running once");
        fetch("/lastusers")
            .then((response) => response.json())
            .then((data) => {
                // console.log("success in fetch after getLastUSers");
                // console.log("data.results.rows: ", data.results.rows);
                setLastUsers(data.results.rows);
            })
            .catch((error) => {
                console.log("error on fetch after getLastUsers: ", error);
            });
    }, []);

    useEffect(() => {
        let abort;
        // console.log(
        //     "useEffect -search people by first name- is running everytime the user does a search"
        // );

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
                    setUsersByName(data.results.rows);
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
            {!first && (
                <ul id="people-info">
                    {lastUsers.map((item, idx) => (
                        <li key={idx}>
                            <Link to={"/username/" + item.id}>
                                <img
                                    height="100px"
                                    src={item.url || "./images/her.jpg"}
                                />
                            </Link>
                            {item.first} {item.last}
                        </li>
                    ))}
                </ul>
            )}
            {first && (
                <ul id="people-info">
                    {usersByName.map((item, idx) => (
                        <li key={idx}>
                            <Link to={"/username/" + item.id}>
                                <img
                                    height="100px"
                                    src={item.url || "./images/her.jpg"}
                                />
                            </Link>
                            {item.first} {item.last}
                        </li>
                    ))}
                </ul>
            )}
            <div id="people-search">
                <p>Looking for someone in particular?</p>
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
