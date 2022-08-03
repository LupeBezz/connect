/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Stuff

const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

app.use(compression());

const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require("cookie-session");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cookie session

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > register

app.post("/registration.json", (req, res) => {
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.password
    ) {
        //TO DO: send an error
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize email
        req.body.email = req.body.email.toLowerCase();
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize first
        req.body.firstName =
            req.body.firstName.charAt(0).toUpperCase() +
            req.body.firstName.slice(1).toLowerCase();
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize last
        req.body.lastName =
            req.body.lastName.charAt(0).toUpperCase() +
            req.body.lastName.slice(1).toLowerCase();

        db.addUser(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            req.body.password
        )
            .then((results) => {
                console.log("addUser worked!");
                console.log("results.rows[0].id: ", results.rows[0].id); // the user id

                // - - - - - - - - - - - - - - - - - - - - store id in cookie
                var loginUserId = results.rows[0].id;
                req.session.loginId = loginUserId;
                //res.send(`loginId: ${req.session.loginId}`);

                // - - - - - - - - - - - - - - - - - - - - create route for the user
                // history.pushState(null, null, `/users/${loginUserId}`);

                // - - - - - - - - - - - - - - - - - - - - send back answer
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in addUser", err);
                res.json({ success: false });
            });
        console.log("post request to /register works");
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request * > serve html - always at the end!!!

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 3001;

app.listen(process.env.PORT || PORT, function () {
    console.log("I'm listening.");
});
