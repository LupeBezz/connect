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
import ProfileOthers from "./Profileothers";
import Logout from "./Logout";
import FriendsAndWannabes from "./Friendsandwannabes";

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
            isFindPeopleOpen: false,
            isMyFriendsOpen: false,
            isChatOpen: false,
            message: "",
            bio: "",
            errorMessage: "",
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);
        this.saveDraftBio = this.saveDraftBio.bind(this);
        this.toggleTabsPeople = this.toggleTabsPeople.bind(this);
        this.toggleTabsFriends = this.toggleTabsFriends.bind(this);
        this.toggleTabsChat = this.toggleTabsChat.bind(this);
        this.closeTabs = this.closeTabs.bind(this);
    }

    //this runs after the render()!
    componentDidMount() {
        console.log("App Mounted");
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

    toggleTabsPeople() {
        //if open it closes it, if closed it opens it
        this.setState({
            isFindPeopleOpen: true,
            isMyFriendsOpen: false,
            isChatOpen: false,
        });
    }

    toggleTabsFriends() {
        //if open it closes it, if closed it opens it
        this.setState({
            isFindPeopleOpen: false,
            isMyFriendsOpen: true,
            isChatOpen: false,
        });
    }

    toggleTabsChat() {
        //if open it closes it, if closed it opens it
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
        //we want to prevent the automatic upload, because we want to do dome checks
        e.preventDefault();

        console.log("form trying to submit");

        // check if there is a file or not - fileInput.files returns an array with (or without!) files
        const form = e.currentTarget;
        const fileInput = form.querySelector("input[type=file]");

        if (fileInput.files.length < 1) {
            this.setState.errorMessage = "please select a file!";
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
                console.log("serverData: ", serverData);
                this.setState({
                    picture: serverData.fullUrl,
                    errorMessage: serverData.message,
                });
                this.toggleModal();
                //console.log(this.state.picture);
            })
            .catch((err) => {
                this.setState.message =
                    "There has been a problem, please try again";
            });
    }
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
                            {this.state.errorMessage && (
                                <p className="error">
                                    {this.state.errorMessage}
                                </p>
                            )}
                            {/* {this.state.isModalOpen && ( )} */}
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
                                    errorMessage={this.errorMessage}
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
                            to="/"
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default App;
