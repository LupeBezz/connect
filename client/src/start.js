/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import ReactDOM from "react-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import Welcome from "./components/Welcome";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ReactDOM.render()

//ReactDOM.render(<Welcome />, document.querySelector("main"));

// this check if the visitor is registered or not, by checking the cookie:
fetch("users/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            //visitor is not registered, he should see the registration page
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //visitor is registered, he should be redirected
            ReactDOM.render(
                <img src="./images/strawberry.jpg" height="200px" alt="logo" />,
                document.querySelector("main")
            );
        }
    });
