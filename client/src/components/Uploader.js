/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import { Component } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Uploader component

export class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = { errorMessage: "" };
        this.onFormInputChange = this.onFormInputChange.bind(this);
    }

    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
    }
    render() {
        return (
            <div id="editor-upload">
                <h2>Your picture</h2>

                <form method="post" onSubmit={this.props.uploadPicture}>
                    <input
                        type="file"
                        name="uploadPicture"
                        id="editor-upload-picture"
                        accept="image/*"
                    />
                    <input
                        type="submit"
                        value="upload"
                        id="editor-upload-submit"
                    />
                </form>
                {this.props.errorMessageUploader && (
                    <p className="uploader-error">
                        {this.props.errorMessageUploader}
                    </p>
                )}
            </div>
        );
    }
}
