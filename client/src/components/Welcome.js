/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { BrowserRouter, Route } from "react-router-dom";

import { Logo } from "./Logo";
import { Registration } from "./Registration";
import { Login } from "./Login";
import { ResetPassword } from "./Resetpassword";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Welcome component

export function Welcome() {
    return (
        <>
            <Logo />

            <div id="welcome-page">
                <div>
                    <h1>
                        Connect
                        <br /> with your
                        <br /> loved ones!
                    </h1>
                    <BrowserRouter>
                        <Route exact path="/">
                            <Registration />
                        </Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/resetpassword">
                            <ResetPassword />
                        </Route>
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
