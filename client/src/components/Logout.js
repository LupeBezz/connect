/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Logout component

export function Logout() {
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch("/logout")
            .then(() => {
                location.href = "/";
            })
            .catch((error) => {
                console.log("error on fetch after logout ", error);
            });
    }, []);

    return <></>;
}
