/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import { Profile } from "./Profile";
import { ProfilePic } from "./Profilepic";
import { Uploader } from "./Uploader";
import { Logo } from "./Logo";
import { FindPeople } from "./Findpeople";
import { ProfileOthers } from "./Profileothers";
import { Logout } from "./Logout";
import { FriendsAndWannabes } from "./Friendsandwannabes";
import { Chat } from "./Chat";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the App component

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            userId: "",
            email: "",
            picture: "",
            bio: "",
            tabOpen: "",
            message: "",
            errorMessage: "",
            uploaderMessage: "",
        };
        this.uploadPicture = this.uploadPicture.bind(this);
        this.saveDraftBio = this.saveDraftBio.bind(this);
        this.toggleTabs = this.toggleTabs.bind(this);
        this.closeTabs = this.closeTabs.bind(this);
    }

    componentDidMount() {
        fetch("/userinfo")
            .then((response) => response.json())
            .then((data) => {
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

    toggleTabs(e) {
        console.log(e.target.id);
        this.setState({
            tabOpen: e.target.id,
        });
    }

    closeTabs() {
        this.setState({
            tabOpen: "",
        });
    }

    saveDraftBio(draftBio) {
        this.setState({ bio: draftBio });
    }

    uploadPicture(e) {
        e.preventDefault();

        // is there is a file or not?
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");

        if (fileInput.files.length < 1) {
            this.setState({ uploaderMessage: "please select a file!" });
            return;
        }

        // is the file too big?
        if (fileInput.files[0].size > 2000000) {
            this.setState({
                uploaderMessage: "your picture cannot be bigger than 2MB",
            });
            return;
        }

        // now we submit the form
        this.setState({
            uploaderMessage: "your picture is being uploaded",
        });

        const formData = new FormData(form);
        fetch("/uploadimage.json", { method: "post", body: formData })
            .then((res) => res.json())

            .then((serverData) => {
                this.setState({
                    picture: serverData.fullUrl,
                    uploaderMessage: "",
                });
            })
            .catch((err) => {
                this.setState({
                    uploaderMessage:
                        "There has been a problem, please try again",
                });
            });
    }

    render() {
        return (
            <>
                <Logo />

                <BrowserRouter>
                    <Link to="/profile" onClick={this.closeTabs}>
                        <ProfilePic
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            picture={this.state.picture}
                        />
                    </Link>

                    <Link to="/" id="link-main" onClick={this.closeTabs}>
                        Main page
                    </Link>

                    <Link
                        to="/profile"
                        id="link-profile"
                        onClick={this.closeTabs}
                    >
                        Profile
                    </Link>

                    <Link to="/logoutuser" id="link-logout">
                        Logout
                    </Link>

                    <div>
                        <Route exact path="/">
                            <h1 id="main-greeting">Welcome</h1>
                            <p id="main-introduction">
                                {" "}
                                Connect allows you to stay in touch with your
                                loved ones! You can update you information on
                                the right corner or connect with other people by
                                clicking the orange tabs!
                            </p>
                            <img
                                id="main-image-kids"
                                src="/images/440300.jpg"
                                height="400px"
                                alt="kids"
                            />
                        </Route>
                        <Route exact path="/profile">
                            <>
                                <Profile
                                    firstName={this.state.firstName}
                                    lastName={this.state.lastName}
                                    picture={this.state.picture}
                                    bio={this.state.bio}
                                    saveDraftBio={this.saveDraftBio}
                                />
                                <Uploader
                                    uploadPicture={this.uploadPicture}
                                    uploaderMessage={this.state.uploaderMessage}
                                />
                            </>
                        </Route>
                        <Route exact path="/logoutuser">
                            <Logout />
                        </Route>
                        <Route exact path="/people">
                            <FindPeople />
                        </Route>
                        <Route path="/username/:id">
                            <ProfileOthers />
                        </Route>
                        <Route path="/friends">
                            <FriendsAndWannabes />
                        </Route>
                        <Route path="/chat">
                            <Chat />
                        </Route>
                    </div>

                    <div>
                        <Link
                            to="/people"
                            id="tab-people"
                            className={
                                this.state.tabOpen === "tab-people"
                                    ? "tab tab-active"
                                    : "tab tab-inactive"
                            }
                            onClick={this.toggleTabs}
                        >
                            Find people
                        </Link>

                        <Link
                            to="/friends"
                            id="tab-friends"
                            className={
                                this.state.tabOpen === "tab-friends"
                                    ? "tab tab-active"
                                    : "tab tab-inactive"
                            }
                            onClick={this.toggleTabs}
                        >
                            My friends
                        </Link>

                        <Link
                            to="/chat"
                            id="tab-chat"
                            className={
                                this.state.tabOpen === "tab-chat"
                                    ? "tab tab-active"
                                    : "tab tab-inactive"
                            }
                            onClick={this.toggleTabs}
                        >
                            Chat
                        </Link>
                    </div>
                </BrowserRouter>

                <img
                    id="main-image"
                    src="/images/44030.jpg"
                    height="400px"
                    alt="seniors"
                />
            </>
        );
    }
}
