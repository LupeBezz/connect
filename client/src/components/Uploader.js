/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import { Component } from "react";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - the Uploader component
class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = { errorMessage: "" };
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
                <h2>My profile picture:</h2>

                <form
                    id="upload-form"
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
                {this.state.errorMessage && (
                    <p className="error">{this.state.errorMessage}</p>
                )}
            </>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Exports

export default Uploader;
