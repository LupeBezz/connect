/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

//we need to use formData in order to use the file
//change table to receive an avatar

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Uploader component
class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onFormInputChange = this.onFormInputChange.bind(this);
    }
    componentDidMount() {
        console.log("Uploader mounted");
    }
    onFormInputChange(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: target.value });
        console.log("this.setState: ", this.setState);
    }
    render() {
        return (
            <>
                <p>
                    Hello {this.props.firstName}! Do you want to upload a
                    profile picture?
                </p>
                <form
                    id="upload-form"
                    // action="/uploadimage.json"
                    method="post"
                    onSubmit={this.props.uploadPicture}
                >
                    <input
                        type="file"
                        name="uploadPicture"
                        id="uploadPicture"
                        accept="image/*"
                    />
                    <input type="submit" value="upload" id="uploadSubmit" />
                </form>
            </>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Uploader;
