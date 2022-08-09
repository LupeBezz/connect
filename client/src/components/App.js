/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import Profile from "./Profile";
import ProfilePic from "./Profilepic";
import BioEditor from "./Bioeditor";
import Uploader from "./Uploader";
import Logo from "./Logo";
import FindPeople from "./Findpeople";

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
            bio: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
        this.saveDraftBio = this.saveDraftBio.bind(this);
    }

    // TO DO: add the bio information here!!!
    //this runs after the render()!!
    componentDidMount() {
        console.log("App Mounted");
        //TO DO: here we fetch info from the server and store it into our states
        fetch("/userinfo")
            .then((response) => response.json())
            .then((data) => {
                //console.log("success in fetch after getUserInfoFromId");
                //console.log("data.results.rows[0]: ", data.results.rows[0]);
                let userInfo = data.results.rows[0];
                this.setState({
                    firstName: userInfo.first,
                    lastName: userInfo.last,
                    userId: userInfo.id,
                    email: userInfo.email,
                    picture: userInfo.url || null,
                    bio: userInfo.bio,
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
    // TO DO: pass down to bio editor component
    saveDraftBio(draftBio) {
        this.setState({ bio: draftBio });
        console.log("saveDraftBio function works");
        console.log("draftBio: ", draftBio);
        console.log("this.state.bio: ", this.state.bio);
    }

    render() {
        return (
            <>
                <Logo />
                <ProfilePic
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    userId={this.state.userId}
                    picture={this.state.picture}
                    bio={this.state.bio}
                    toggleModal={this.toggleModal}
                    saveDraftBio={this.saveDraftBio}
                />
                <BrowserRouter>
                    <div>
                        <Route exact path="/">
                            {/* <ProfilePic
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                userId={this.state.userId}
                                picture={this.state.picture}
                                bio={this.state.bio}
                                toggleModal={this.toggleModal}
                                saveDraftBio={this.saveDraftBio}
                            /> */}

                            {this.state.isModalOpen && (
                                <>
                                    <Uploader
                                        firstName={this.state.firstName}
                                        uploadPicture={this.uploadPicture}
                                    />
                                    <Profile
                                        firstName={this.state.firstName}
                                        lastName={this.state.lastName}
                                        userId={this.state.userId}
                                        picture={this.state.picture}
                                        bio={this.state.bio}
                                        toggleModal={this.toggleModal}
                                        saveDraftBio={this.saveDraftBio}
                                    />
                                </>
                            )}

                            <h2>{this.state.message}</h2>
                        </Route>

                        <Route exact path="/people">
                            <FindPeople />
                        </Route>
                    </div>
                    <div className="button-tab">
                        <p>Find your friends here</p>
                        <Link to="/people" id="link">
                            Find friends
                        </Link>
                    </div>
                </BrowserRouter>
            </>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default App;
