/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { Registration } from "./Registration";
import { Login } from "./Login";
import { ResetPassword } from "./Resetpassword";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Welcome component

export class Welcome extends Component {
    render() {
        return (
            <>
                <div id="logo">Connect</div>
                <div id="welcome-page">
                    <div id="welcome-title">
                        <h1>
                            Connect
                            <br /> with your <br /> loved ones!
                        </h1>

                        <BrowserRouter>
                            <div id="welcome-reg-login">
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
                    </div>
                    <img
                        id="welcome-image"
                        src="./images/5527.jpg"
                        height="500px"
                        alt="seniors dancing"
                    />
                </div>
            </>
        );
    }
}
