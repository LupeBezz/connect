/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component

class Registration extends Component {
    constructor() {
        super(); //calls the constructor of the parent class. Used to access some variables in the parent

        this.state = {
            firstName: "",
            lastName: "",
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
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
        };
        fetch("/registration.json", {
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
                    location.reload();
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }
    render() {
        return (
            <div id="registrationPage">
                <h2>Registration</h2>

                {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )}

                <form
                    id="registrationForm"
                    method="post"
                    action="/registration.json"
                    onSubmit={this.onFormSubmit}
                >
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={this.state.firstName}
                        onChange={this.onFormInputChange}
                    ></input>

                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={this.state.lastName}
                        onChange={this.onFormInputChange}
                    ></input>

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

                    <input
                        id="registrationButton"
                        type="submit"
                        value="register"
                    ></input>
                </form>

                <div>
                    <p>Already a member?</p>
                    <p>
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Registration;
