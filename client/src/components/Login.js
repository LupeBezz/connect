/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component

class Login extends Component {
    constructor() {
        super(); //calls the constructor of the parent class. Used to access some variables in the parent

        this.state = {
            email: "",
            password: "",
            errorMessage: "",
            error: false,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    // we see when info is being entered in the input field
    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
        console.log("this.setState: ", this.setState);
    }

    // when submitting the form
    onFormSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        fetch("/login.json", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data);
                //render error conditionally
                if (!data.success && data.message) {
                    this.setState({ errorMessage: data.message });
                } else {
                    location.href = "/";
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }
    render() {
        return (
            <div id="loginPage">
                <h2>Login</h2>

                {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )}

                <form
                    id="loginForm"
                    method="post"
                    action="/login.json"
                    onSubmit={this.onFormSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.onFormInputChange}
                    ></input>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.onFormInputChange}
                    ></input>

                    <input id="loginButton" type="submit" value="login"></input>
                </form>

                <div>
                    <p>Did you forget your password?</p>
                    <p>
                        <Link to="/resetpassword">Reset password</Link>
                    </p>
                    <p>Or you can register here</p>
                    <p>
                        <Link to="/">Register</Link>
                    </p>
                </div>
            </div>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Login;
