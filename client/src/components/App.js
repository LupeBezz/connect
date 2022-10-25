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
            picture: "",
            email: "",
            isModalOpen: false,
            isFindPeopleOpen: false,
            isMyFriendsOpen: false,
            isChatOpen: false,
            message: "",
            bio: "",
            errorMessage: "",
            errorMessageUploader: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
        this.saveDraftBio = this.saveDraftBio.bind(this);
        this.toggleTabsPeople = this.toggleTabsPeople.bind(this);
        this.toggleTabsFriends = this.toggleTabsFriends.bind(this);
        this.toggleTabsChat = this.toggleTabsChat.bind(this);
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

    toggleModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    toggleTabsPeople() {
        this.setState({
            isFindPeopleOpen: true,
            isMyFriendsOpen: false,
            isChatOpen: false,
        });
    }

    toggleTabsFriends() {
        this.setState({
            isFindPeopleOpen: false,
            isMyFriendsOpen: true,
            isChatOpen: false,
        });
    }

    toggleTabsChat() {
        this.setState({
            isFindPeopleOpen: false,
            isMyFriendsOpen: false,
            isChatOpen: true,
        });
    }

    closeTabs() {
        this.setState({
            isFindPeopleOpen: false,
            isMyFriendsOpen: false,
            isChatOpen: false,
        });
    }

    uploadPicture(e) {
        e.preventDefault();

        // is there is a file or not? - fileInput.files returns an array with (or without!) files
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");

        if (fileInput.files.length < 1) {
            this.setState({ errorMessageUploader: "please select a file!" });
            console.log("error in uploader: no file");
            return;
        }

        // is the file too big? (max 10MB = 10.000.000)

        if (fileInput.files[0].size > 2000000) {
            this.setState({
                errorMessageUploader: "your picture cannot be bigger than 2MB",
            });
            return;
        }

        // now we submit the form
        this.setState({
            errorMessageUploader: "your picture is being uploaded",
        });

        const formData = new FormData(form);
        fetch("/uploadimage.json", { method: "post", body: formData })
            .then((res) => res.json())

            .then((serverData) => {
                this.setState({
                    picture: serverData.fullUrl,
                    errorMessageUploader: "",
                });
                this.toggleModal();
            })
            .catch((err) => {
                this.setState({
                    errorMessageUploader:
                        "There has been a problem, please try again",
                });
            });
    }
    saveDraftBio(draftBio) {
        this.setState({ bio: draftBio });
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
                            userId={this.state.userId}
                            picture={this.state.picture}
                            bio={this.state.bio}
                            toggleModal={this.toggleModal}
                            saveDraftBio={this.saveDraftBio}
                            onClick={this.state.toggleModal}
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
                    <Link id="link-logout" to="/logoutuser">
                        Logout
                    </Link>
                    <div>
                        <Route exact path="/">
                            <div className="greeting">
                                <p>Welcome</p>
                            </div>
                            <div id="how-it-works">
                                <p>
                                    {" "}
                                    Connect allows you to stay in touch with
                                    your loved ones! You can update you
                                    information on the right corner or connect
                                    with other people by clicking the orange
                                    tabs!
                                </p>
                            </div>
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
                                    userId={this.state.userId}
                                    picture={this.state.picture}
                                    bio={this.state.bio}
                                    toggleModal={this.toggleModal}
                                    saveDraftBio={this.saveDraftBio}
                                />
                                <Uploader
                                    firstName={this.state.firstName}
                                    uploadPicture={this.uploadPicture}
                                    errorMessageUploader={
                                        this.state.errorMessageUploader
                                    }
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

                    <div
                        id="tab-people"
                        className={
                            this.state.isFindPeopleOpen === true
                                ? "tab-active"
                                : "tab-inactive"
                        }
                    >
                        <Link
                            to="/people"
                            className="tab-text"
                            onClick={this.toggleTabsPeople}
                        >
                            Find people
                        </Link>
                    </div>

                    <div
                        id="tab-friends"
                        className={
                            this.state.isMyFriendsOpen === true
                                ? "tab-active"
                                : "tab-inactive"
                        }
                    >
                        <Link
                            to="/friends"
                            className="tab-text"
                            onClick={this.toggleTabsFriends}
                        >
                            My friends
                        </Link>
                    </div>

                    <div
                        id="tab-chat"
                        className={
                            this.state.isChatOpen === true
                                ? "tab-active"
                                : "tab-inactive"
                        }
                    >
                        <Link
                            to="/chat"
                            className="tab-text"
                            onClick={this.toggleTabsChat}
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
