/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Registration component

class Registration extends Component {
    constructor() {
        super(); //calls the constructor of the parent class

        this.state = {
            isUserLoggedIn: false,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            error: true,
        };
        this.onFormInputChange = this.onFormInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
        console.log(this.setState);
    }

    onFormSubmit() {
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
                //TO DO: if reg not successful: render error conditionally
                //TO DO: if reg was successful: reload page, trigger page reload to re-run start.js (location.reload())
            })
            .catch((error) => {
                console.log(error);
                //TO DO: render an error
            });
    }
    render() {
        return (
            <>
                <h2>Registration</h2>

                {this.state.error && (
                    <p className="registrationError">
                        oops, something went wrong!
                    </p>
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

                    <input type="submit" value="register"></input>
                </form>

                <p>Already a member?</p>
                <a href="this should take us to Log in">Log in</a>
            </>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Registration;
