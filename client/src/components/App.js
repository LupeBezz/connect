/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import Logo from "./Logo";
import ProfilePic from "./Profilepic";
import Uploader from "./Uploader";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the App component

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            userId: "",
            picture: "",
            email: "",
            isModalOpen: false,
            message: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
    }

    //this runs after the render()!!
    componentDidMount() {
        console.log("App Mounted");
        //TO DO: here we fetch info from the server and store it into our states
        fetch("/userinfo")
            .then((response) => response.json())
            .then((data) => {
                console.log("success in fetch after getUserInfoFromId");
                console.log("data.results.rows[0]: ", data.results.rows[0]);
                let userInfo = data.results.rows[0];
                this.setState({
                    firstName: userInfo.first,
                    lastName: userInfo.last,
                    userId: userInfo.id,
                    email: userInfo.email,
                    picture: userInfo.url || null,
                });
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }

    toggleModal() {
        //if open it closes it, if closed it opens it
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    uploadPicture(e) {
        //we want to prevent the automatic upload, because we want to check first whether there is file or not
        e.preventDefault();

        console.log("form trying to submit");

        // check if there is a file or not - fileInput.files returns an array with (or without!) files
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");

        if (fileInput.files.length < 1) {
            this.setState.message = "please select a file!";
            return;
        }

        //is the file too big? (max 10MB = 10.000.000)

        if (fileInput.files[0].size > 2000000) {
            this.setState.message = "your picture cannot be bigger than 2MB";
            return;
        }

        //now that we know that everything is ok, we submit the form
        this.setState.message = "your file is being uploaded";

        const formData = new FormData(form);
        fetch("/uploadimage.json", { method: "post", body: formData })
            .then((res) => res.json())

            .then((serverData) => {
                // console.log("serverData: ", serverData);
                this.setState({ picture: serverData });
                this.toggleModal();
                //console.log(this.state.picture);
            })
            .catch((err) => {
                this.setState.message =
                    "There has been a problem, please try again";
            });
    }

    render() {
        return (
            <>
                {/* //we pass props (info + functions) to the child components here. The first word is the name it will have there */}
                <Logo />
                <ProfilePic
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    userId={this.state.userId}
                    picture={this.state.picture}
                    toggleModal={this.toggleModal}
                />
                {this.state.isModalOpen && (
                    <Uploader
                        firstName={this.state.firstName}
                        uploadPicture={this.uploadPicture}
                    />
                )}
                <h2>{this.state.message}</h2>

                <h2>Hello </h2>
            </>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default App;
