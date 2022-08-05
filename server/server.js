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
        res.json({ success: false, message: "All fields are necessary" });
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
                console.log("results.rows[0].id: ", results.rows[0].id); // the user id

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
                    message: "Something went wrong, please try again!",
                });
            });
        console.log("post request to /register works");
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request > login

app.post("/login.json", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, message: "All fields are necessary" });
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
                        message:
                            "It looks like you don't have an account with us",
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
                            console.log(result);
                            if (result) {
                                console.log("Success in Password Comparison");

                                // - - - - - - - - - - - - - - - - - - - - store id in cookie
                                var userId = results.rows[0].id;
                                console.log(results.rows[0].id);
                                req.session = { userId };
                                //res.send(`loginId: ${req.session.loginId}`);
                                res.json({
                                    success: true,
                                });
                            } else {
                                console.log("Error in Password Comparison");
                                res.json({
                                    success: false,
                                    message:
                                        "Something went wrong, please try again",
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
                        message:
                            "It looks like you don't have an account with us",
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
                                            "The code was sent successfully to your email",
                                    });
                                })
                                .catch((err) => {
                                    console.log("Error in sendCodeEmail", err);
                                    res.json({
                                        success: false,
                                        message:
                                            "Something went wrong, please try again",
                                    });
                                });
                        })
                        .catch((err) => {
                            "error in addSecretCode", err;
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - post request >  verify password

app.post("/resetpassword/verify.json", (req, res) => {
    if (!req.body.code || !req.body.password) {
        res.json({ success: false, message: "Please insert a valid email" });
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
                    // res.json({
                    //     success: true,
                    //     message: "Your code is correct!",
                    // });
                    //console.log("req.body.email :", req.body.email);
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
                                message:
                                    "Something went wrong, please try again",
                            });
                        });
                } else {
                    res.json({
                        success: false,
                        message: "Your code is not correct, please try again!",
                    });
                }
            })
            .catch((err) => {
                console.log("error in checkSecretCode", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
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

        let fullUrl =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        db.insertImage(req.session.userId, fullUrl)
            .then((results) => {
                console.log("insertImage worked!");
                console.log("results:", results);
                res.json(fullUrl);
            })
            .catch((err) => {
                console.log("error in insertImage", err);
            });
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request /userinfo > get all info from logged in user

app.get("/userinfo", function (req, res) {
    db.getUserInfoFromId(req.session.userId)
        .then((results) => {
            console.log("results.rows[0] :", results.rows[0]);
            res.json({
                results,
            });
        })
        .catch((error) => console.log("error in getUserInfoFromId: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - get request users/id.json > see if user is logged in

app.get("/users/id.json", function (req, res) {
    res.json({ userId: req.session.userId });
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
