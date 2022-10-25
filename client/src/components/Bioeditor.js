/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the BioEditor component

export class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = { draftBio: "", isEditorOpen: false, bio: "" };
        this.toggleEditor = this.toggleEditor.bind(this);
        this.onBioInputChange = this.onBioInputChange.bind(this);
        this.fetchNewBioToServer = this.fetchNewBioToServer.bind(this);
    }

    toggleEditor() {
        this.setState({ isEditorOpen: !this.state.isEditorOpen });
    }

    onBioInputChange(e) {
        this.setState({ draftBio: e.target.value });
    }

    fetchNewBioToServer() {
        this.toggleEditor();
        this.props.saveDraftBio(this.state.draftBio);
        const userBio = this.state.draftBio;

        fetch("/insertbio.json", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userBio }),
        })
            .then((response) => response.json())
            .then((data) => {
                //render error conditionally
                if (!data.success && data.message) {
                    this.setState({ errorMessage: data.message });
                } else {
                    this.setState.bio = data.userBio;
                }
            })
            .catch((error) => {
                console.log("error on fetch after onFormSubmit: ", error);
            });
    }

    render() {
        return (
            <>
                <div id="editor-bio">
                    <h2>Your bio</h2>
                    {this.state.isEditorOpen ? (
                        <>
                            <textarea
                                name="bio"
                                cols="30"
                                rows="10"
                                onChange={this.onBioInputChange}
                            >
                                {this.props.bio}
                            </textarea>
                            <button
                                onClick={
                                    (this.toggleEditor,
                                    this.fetchNewBioToServer)
                                }
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            {this.props.bio ? (
                                <>
                                    <p>{this.props.bio}</p>
                                    <button onClick={this.toggleEditor}>
                                        edit
                                    </button>
                                </>
                            ) : (
                                <button onClick={this.toggleEditor}>Add</button>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }
}
