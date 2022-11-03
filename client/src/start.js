/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - imports

import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer.js";

import { Welcome } from "./components/Welcome";
import { App } from "./components/App";
import { init } from "./socket.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ReactDOM.render()

// We create a Redux store, pass it our root reducer, and apply the redux-immutable-state-invariant middleware
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// We check if the visitor is registered or not and render the necessary component
fetch("/users/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // We initialise the socket.io server and pass it the store
            // We wrap the App component with the Provider component (from react-redux) and pass the store to it as a prop
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    {" "}
                    <App />
                </Provider>,
                document.querySelector("main")
            );
        }
    });
