/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component } from "react";
import { Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component
// on a function component we could use onFormInputChange and onForm Submit as reusable Hooks
// but I will keep it a class component for practice

export class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: "",
            password: "",
            errorMessage: "",
            error: false,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
    }

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
                <form
                    className="reg-login-form"
                    method="post"
                    action="/login.json"
                    onSubmit={this.onFormSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={this.onFormInputChange}
                    ></input>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.onFormInputChange}
                    ></input>

                    <input
                        className="reg-login-button"
                        type="submit"
                        value="login"
                    ></input>
                </form>

                <div>
                    <p>
                        Forgot your password? {" > "}
                        <Link to="/resetpassword" id="link">
                            reset
                        </Link>
                    </p>

                    <p>
                        No account yet?{" > "}
                        <Link to="/" id="link">
                            register
                        </Link>
                    </p>
                </div>

                {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )}
            </div>
        );
    }
}
