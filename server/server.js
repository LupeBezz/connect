/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - create servers

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - application server (express)

const express = require("express");
const app = express();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - web server (node)

const server = require("http").Server(app);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// to work with file and directory paths
const path = require("path");

// to compress response bodies for all requests
const compression = require("compression");
app.use(compression());

// to hash passwords
const bcrypt = require("bcryptjs");

// to parse cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// to parse the request bodies in forms and make the info available as req.body
app.use(express.urlencoded({ extended: false }));

// to unpack JSON in the request body
app.use(express.json());

// to generate a cryptographically strong random string
const cryptoRandomString = require("crypto-random-string");

// (aws) to send emails
const ses = require("./ses");

// (aws) to upload files to aws
const s3 = require("./s3");

// to store files in the local server
const uploader = require("./middleware").uploader;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - require our database

const db = require("./db");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - serve public folder and uploads

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - cookie session middleware

const cookieSession = require("cookie-session");

const SESSION_SECRET =
    process.env.SESSION_SECRET || require("./secrets.json").SESSION_SECRET;

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - socket io middleware

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - on connect

    const userId = socket.request.session.userId;
    console.log(
        `User with id: ${userId} and socket: ${socket.id} is connected`
    );

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - on disconnect

    socket.on("disconnect", () => {
        console.log(
            `User with id: ${userId} and socket: ${socket.id} has just disconnected`
        );
    });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - emit chatMessages

    // array of the last 10 messages emited to the socket that just connected

    var lastMessages;

    db.getLastMessages()
        .then((results) => {
            lastMessages = results.rows;
            socket.emit("chatMessages", lastMessages);
        })
        .catch((err) => {
            console.log("error in getLastMessages", err);
        });

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - on chatNewMessage

    // the new chat message must be stored in the db and sent to all connected sockets

    socket.on("chatNewMessage", ({ message }) => {
        var newMessage;
        db.insertMessage(message, userId)
            .then((results) => {
                newMessage = results.rows[0];
                io.emit("add-chatNewMessage", newMessage);
            })
            .catch((err) => {
                console.log("error in insertMessage", err);
            });
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - sanitizing functions

const sanitizeEmail = (email) => {
    return email.toLowerCase();
};

const sanitizeName = (name) => {
    var sanitizedName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return sanitizedName;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - routes

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REGISTER

app.post("/registration.json", (req, res) => {
    if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({ success: false, message: "All fields are necessary!" });
    } else {
        db.addUser(
            sanitizeName(req.body.firstName),
            sanitizeName(req.body.lastName),
            sanitizeEmail(req.body.email),
            req.body.password
        )
            .then((results) => {
                // store id in cookie
                var userId = results.rows[0].id;
                req.session = { userId };
                //res.send(`loginId: ${req.session.loginId}`);
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in addUser", err);
                res.json({
                    success: false,
                    message: "oops, something went wrong!",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LOGIN

app.post("/login.json", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, message: "All fields are necessary!" });
    } else {
        // check user
        db.getUserInfo(sanitizeEmail(req.body.email))
            .then((results) => {
                if (results.rows.length === 0) {
                    console.log("Error in getUserInfo: email not found");
                    res.json({
                        success: false,
                        message: "oops, something went wrong!",
                    });
                } else {
                    // compare password to the on in the database
                    let inputPassword = req.body.password;
                    let databasePassword = results.rows[0].password;
                    return bcrypt
                        .compare(inputPassword, databasePassword)
                        .then((result) => {
                            if (result) {
                                // store id in cookie
                                var userId = results.rows[0].id;
                                req.session = { userId };
                                //res.send(`loginId: ${req.session.loginId}`);
                                res.json({ success: true });
                            } else {
                                console.log(
                                    "Error in getUserInfo: Password is not correct"
                                );
                                res.json({
                                    success: false,
                                    message: "please try again!",
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
                console.log("Error in getUserInfo", err);
                res.json({
                    success: false,
                    message: "Something went wrong, please try again",
                });
            });
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - RESET PASSWORD

app.post("/resetpassword/start.json", (req, res) => {
    if (!req.body.email) {
        res.json({ success: false, message: "Please insert a valid email" });
    } else {
        // check user
        db.getUserInfo(sanitizeEmail(req.body.email))
            .then((results) => {
                if (results.rows.length === 0) {
                    console.log("Error in getUserInfo: email not found");
                    res.json({
                        success: false,
                        message: "oops, something went wrong!",
                    });
                } else {
                    // success! > generate and add secret code to db
                    const secretCode = cryptoRandomString({
                        length: 6,
                    });
                    db.addSecretCode(sanitizeEmail(req.body.email), secretCode)
                        .then((results) => {
                            // success! > send email
                            ses.sendCodeEmail(secretCode)
                                .then((result) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - RESET PASSWORD: VERIFY CODE

app.post("/resetpassword/verify.json", (req, res) => {
    if (!req.body.code || !req.body.password) {
        res.json({ success: false, message: "oops, something went wrong!" });
    } else {
        // check Code
        db.checkSecretCode()
            .then((results) => {
                let possibleCodes = results.rows;
                if (
                    possibleCodes[possibleCodes.length - 1].code ===
                    req.body.code
                ) {
                    db.updatePassword(req.body.password, req.body.email)
                        .then((results) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - UPLOAD PROFILE PICTURE

app.post(
    "/uploadimage.json",
    uploader.single("uploadPicture"),
    s3.upload,
    (req, res) => {
        if (!req.file) {
            res.json({ message: "please select a file!" });
        }
        let fullUrl =
            "https://s3.amazonaws.com/spicedling/" + req.file.filename;

        db.insertImage(req.session.userId, fullUrl)
            .then((results) => {
                res.json({ fullUrl, message: "image updated successfully!" });
            })
            .catch((err) => {
                console.log("error in insertImage", err);
            });
    }
);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SAVE BIO

app.post("/insertbio.json", (req, res) => {
    db.insertBio(req.session.userId, req.body.userBio)
        .then((results) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET INFO FROM LOGGED IN USER

app.get("/userinfo", function (req, res) {
    db.getUserInfoFromId(req.session.userId)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in getUserInfoFromId: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET INFO FROM ANOTHER USER

app.get("/otherusersinfo/:id", function (req, res) {
    if (req.params.id == req.session.userId) {
        console.log("same user as profile");
        res.json({
            self: true,
        });
    } else {
        db.getUserInfoFromId(req.params.id)
            .then((results) => {
                res.json({ results });
            })
            .catch((error) =>
                console.log("error in getUserInfoFromId (other users): ", error)
            );
    }
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET INFO FROM LAST USERS

app.get("/lastusers", function (req, res) {
    db.getLastUsers(req.session.userId)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in getLastUsers: ", error));
});

app.post("/lastusersbyname", function (req, res) {
    db.getUsersByName(req.body.first)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in getUsersByName: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REQUEST FRIENDSHIP

app.post("/friendship/request/:id", (req, res) => {
    db.requestFriendship(req.session.userId, req.params.id)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in requestFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ACCEPT FRIENDSHIP

app.post("/friendship/accept/:id", function (req, res) {
    db.acceptFriendship(req.session.userId, req.params.id)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in acceptFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - DELETE FRIENDSHIP

app.post("/friendship/delete/:id", function (req, res) {
    db.deleteFriendship(req.session.userId, req.params.id)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in deleteFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CHECK FOR FRIENDSHIP

app.get("/friendship/check/:id", function (req, res) {
    db.checkFriendship(req.session.userId, req.params.id)
        .then((results) => {
            res.json({ results });
        })
        .catch((error) => console.log("error in checkFriendship: ", error));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - GET FRIENDS AND WANNABES

app.get("/friends-and-wannabes", function (req, res) {
    db.getFriendsAndWannabes(req.session.userId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((error) =>
            console.log("error in getFriendsAndWannabes: ", error)
        );
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CHECK IF USER IS LOGGED IN

app.get("/users/id.json", function (req, res) {
    res.json({ userId: req.session.userId });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LOGOUT

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - SERVE HTML (always in the end!)

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - listen to the server

const PORT = 3001;

server.listen(process.env.PORT || PORT, function () {
    console.log("I'm listening.");
});
