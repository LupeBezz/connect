/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Imports

import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - our Imports
//if exported "default" import withouth {}

import Welcome from "./components/Welcome";
import App from "./components/App";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ReactDOM.render()

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// this check if the visitor is registered or not, by checking the cookie:
fetch("/users/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            //visitor is not registered, he should see the registration page
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            //visitor is registered, he should be redirected
            ReactDOM.render(
                <Provider store={store}>
                    {" "}
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    });
