/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - general Stuff

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
app.use(express.json()); // to unpack JSON in the request body

const cryptoRandomString = require("crypto-random-string");

const ses = require("./ses");
const s3 = require("./s3");
const uploader = require("./middleware").uploader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder and uploads

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cookie session

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > register

app.post("/registration.json", (req, res) => {
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({ success: false, message: "All fields are necessary!" });
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
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - add User
        db.addUser(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            req.body.password
        )
            .then((results) => {
                console.log("addUser worked!");
                //console.log("results.rows[0].id: ", results.rows[0].id); // the user id

                // - - - - - - - - - - - - - - - - - - - - store id in cookie
                var userId = results.rows[0].id;
                req.session = { userId };
                //res.send(`loginId: ${req.session.loginId}`);

                // - - - - - - - - - - - - - - - - - - - - send back answer
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in addUser", err);
                res.json({
                    success: false,
                    message: "oops, something went wrong!",
                });
            });
        console.log("post request to /register works");
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > login

app.post("/login.json", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, message: "All fields are necessary!" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize email
        req.body.email = req.body.email.toLowerCase();

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check User
        db.getUserInfo(req.body.email)
            .then((results) => {
                if (results.rows.length === 0) {
                    console.log("Error in getUserInfo: email not found");
                    res.json({
                        success: false,
                        message: "oops, something went wrong!",
                    });
                } else {
                    console.log("Success in getUserInfo: email found");

                    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - compare password to the on in the database
                    let inputPassword = req.body.password;
                    let databasePassword = results.rows[0].password;
                    console.log(databasePassword);

                    return bcrypt
                        .compare(inputPassword, databasePassword)
                        .then((result) => {
                            //console.log(result);
                            if (result) {
                                console.log("Success in Password Comparison");

                                // - - - - - - - - - - - - - - - - - - - - store id in cookie
                                var userId = results.rows[0].id;
                                //console.log(results.rows[0].id);
                                req.session = { userId };
                                //res.send(`loginId: ${req.session.loginId}`);
                                res.json({
                                    success: true,
                                });
                            } else {
                                console.log("Error in Password Comparison");
                                res.json({
                                    success: false,
                                    message: "oops, something went wrong!",
                                });
                            }
                        })
                        .catch((error) => {
                            console.log("Error in Password Comparison", error);
                            res.json({
                                success: false,
                                message:
                                    "Something went wrong, please try again",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log("error in getUserInfo", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > reset password

app.post("/resetpassword/start.json", (req, res) => {
    if (!req.body.email) {
        res.json({ success: false, message: "Please insert a valid email" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitize email
        req.body.email = req.body.email.toLowerCase();

        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check User
        db.getUserInfo(req.body.email)
            .then((results) => {
                if (results.rows.length === 0) {
                    console.log("Error in getUserInfo: email not found");
                    res.json({
                        success: false,
                        message: "oops, something went wrong!",
                    });
                } else {
                    console.log("Success in getUserInfo: email found");

                    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - generate and add secret code to db
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    db.addSecretCode(req.body.email, secretCode)
                        .then((results) => {
                            console.log("Success in addSecretCode");
                            //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - send email
                            ses.sendCodeEmail(secretCode)
                                .then((result) => {
                                    console.log("Success in sendCodeEmail");
                                    res.json({
                                        success: true,
                                        message:
                                            "The code was sent successfully!",
                                    });
                                })
                                .catch((err) => {
                                    console.log("Error in sendCodeEmail", err);
                                    res.json({
                                        success: false,
                                        message: "oops, something went wrong!",
                                    });
                                });
                        })
                        .catch((err) => {
                            "error in addSecretCode", err;
                            res.json({
                                success: false,
                                message: "oops, something went wrong!",
                            });
                        });
                }
            })
            .catch((err) => {
                console.log("error in getUserInfo", err);
                res.json({
                    success: false,
                    message: "oops, something went wrong!",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request >  verify password

app.post("/resetpassword/verify.json", (req, res) => {
    if (!req.body.code || !req.body.password) {
        res.json({ success: false, message: "oops, something went wrong!" });
    } else {
        //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - check Code
        db.checkSecretCode()
            .then((results) => {
                //console.log("results from checkSecretCode: ", results);
                let possibleCodes = results.rows;

                if (
                    possibleCodes[possibleCodes.length - 1].code ===
                    req.body.code
                ) {
                    db.updatePassword(req.body.password, req.body.email)
                        .then((results) => {
                            console.log("success in updatePassword");
                            res.json({
                                success: true,
                                message:
                                    "Your password was updated successfully",
                            });
                        })
                        .catch((err) => {
                            console.log("error in upatePassword", err);
                            res.json({
                                success: false,
                                message: "oops, something went wrong!",
                            });
                        });
                } else {
                    res.json({
                        success: false,
                        message: "The code is not correct!",
                    });
                }
            })
            .catch((err) => {
                console.log("error in checkSecretCode", err);
                res.json({
                    success: false,
                    message: "oops, something went wrong!",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > upload profile picture

app.post(
    "/uploadimage.json",
    uploader.single("uploadPicture"),
    s3.upload,
    (req, res) => {
        //console.log("inside post -upload.json");
        //console.log("req.body inside post-upload: ", req.body);
        //console.log("req.file inside post-upload:", req.file);
        if (!req.file) {
            res.json({ message: "please select a file!" });
        }
        let fullUrl =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        db.insertImage(req.session.userId, fullUrl)
            .then((results) => {
                console.log("insertImage worked!");
                console.log("results:", results);
                res.json({ fullUrl, message: "oops, something went wrong!" });
            })
            .catch((err) => {
                console.log("error in insertImage", err);
            });
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > save bio

app.post("/insertbio.json", (req, res) => {
    console.log("arriving to server.js");
    console.log("req.body.userBio: ", req.body.userBio);
    db.insertBio(req.session.userId, req.body.userBio)
        .then((results) => {
            console.log("insertBio worked!");
            console.log("results:", results);
            var userBio = req.body.userBio;
            res.json({
                userBio,
                success: true,
            });
        })
        .catch((err) => {
            console.log("error in insertBio", err);
        });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get info from logged-in user

app.get("/userinfo", function (req, res) {
    db.getUserInfoFromId(req.session.userId)
        .then((results) => {
            //console.log("results.rows[0] :", results.rows[0]);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in getUserInfoFromId: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get info from other user

app.get("/otherusersinfo/:id", function (req, res) {
    //console.log("req.params.id: ", req.params.id);
    //console.log("req.session.userId: ", req.session.userId);
    if (req.params.id == req.session.userId) {
        //console.log("same user as profile");
        res.json({
            self: true,
        });
    } else {
        db.getUserInfoFromId(req.params.id)
            .then((results) => {
                //console.log("results.rows[0] :", results.rows[0]);
                //console.log("not same user as profile");
                res.json({
                    results,
                });
            })
            .catch((error) =>
                console.log("error in getUserInfoFromId (other users): ", error)
            );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > get info from last three users

app.get("/lastusers", function (req, res) {
    db.getLastUsers(req.session.userId)
        .then((results) => {
            console.log("results :", results);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in getLastUsers: ", error));
});

app.post("/lastusersbyname", function (req, res) {
    console.log("req.body.first: ", req.body.first);
    db.getUsersByName(req.body.first)
        .then((results) => {
            console.log("results :", results);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in getUsersByName: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - POST request > request friendship

app.post("/friendship/request/:id", (req, res) => {
    console.log("req.params.id: ", req.params.id);
    console.log("req.session.userId: ", req.session.userId);
    db.requestFriendship(req.session.userId, req.params.id)
        .then((results) => {
            console.log("results :", results);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in requestFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - POST request > accept friendship

app.post("/friendship/accept/:id", function (req, res) {
    console.log("req.params.id: ", req.params.id);
    console.log("req.session.userId: ", req.session.userId);
    db.acceptFriendship(req.session.userId, req.params.id)
        .then((results) => {
            console.log("results :", results);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in acceptFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - POST request > delete friendship

app.post("/friendship/delete/:id", function (req, res) {
    console.log("req.params.id: ", req.params.id);
    console.log("req.session.userId: ", req.session.userId);
    db.deleteFriendship(req.session.userId, req.params.id)
        .then((results) => {
            console.log("results :", results);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in deleteFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET request > check friendship

app.get("/friendship/check/:id", function (req, res) {
    console.log("req.params.id: ", req.params.id);
    console.log("req.session.userId: ", req.session.userId);
    db.checkFriendship(req.session.userId, req.params.id)
        .then((results) => {
            console.log("results check friendship :", results);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in checkFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET request > get friends and wannabes

app.get("/friends-and-wannabes", function (req, res) {
    console.log(
        "inside /friends-and-wannabes req.session.userId: ",
        req.session.userId
    );
    db.getFriendsAndWannabes(req.session.userId)
        .then((results) => {
            console.log("results getFriendsAndWannabes :", results);
            res.json(results.rows);
        })
        .catch((error) =>
            console.log("error in getFriendsAndWannabes: ", error)
        );
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request > check if user is logged in

app.get("/users/id.json", function (req, res) {
    res.json({ userId: req.session.userId });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > logout button

app.get("/logout", (req, res) => {
    req.session.userId = null;
    // res.json({});
    res.redirect("/");
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request * > serve html - always at the end!!!

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 3001;

app.listen(process.env.PORT || PORT, function () {
    console.log("I'm listening.");
});
