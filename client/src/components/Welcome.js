/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import Registration from "./Registration";
import Login from "./Login";
import ResetPassword from "./Resetpassword";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Welcome component

class Welcome extends Component {
    render() {
        return (
            <>
                <div id="title">
                    <h1>Welcome to Social Network</h1>
                    <img
                        src="./images/strawberry-logo.jpg"
                        height="200px"
                        alt="logo"
                    />
                </div>
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/resetpassword">
                            <ResetPassword />
                        </Route>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Welcome;
