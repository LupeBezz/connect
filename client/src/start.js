/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import ReactDOM from "react-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import Welcome from "./components/Welcome";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ReactDOM.render()

ReactDOM.render(<Welcome />, document.querySelector("main"));

// TO DO: activate this depending if user is registered or not:
fetch("users/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            //TO DO: user is not registered, he should see the registration page
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //TO DO: user is registered, because the browser had the cookie
            ReactDOM.render(
                //TO DO; design a logo that will display in the page if the user is registered
                <img src="../public/images/strawberry.jpg" alt="logo" />,
                document.querySelector("main")
            );
        }
    })
    .catch(() => {
        ReactDOM.render(<Welcome />, document.querySelector("main"));
    });
