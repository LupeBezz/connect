/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - database info

let dbUrl;

if (process.env.NODE_ENV === "production") {
    dbUrl = process.env.DATABASE_URL;
} else {
    const {
        DB_USER,
        DB_PASSWORD,
        DB_HOST,
        DB_PORT,
        DB_NAME,
    } = require("./secrets.json");
    dbUrl = `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// to hash passwords
const bcrypt = require("bcryptjs");

// to handle the database
const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets middleware

let sessionSecret;

if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets.json").SESSION_SECRET;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - database functions

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - REGISTER

function hashPassword(password) {
    return bcrypt
        .genSalt()
        .then((salt) => {
            return bcrypt.hash(password, salt);
        })
        .then((hashedPassword) => {
            return hashedPassword;
        });
}

module.exports.addUser = (first, last, email, password) => {
    return hashPassword(password).then((hashedPassword) => {
        return db.query(
            `INSERT INTO users(first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
            [first, last, email, hashedPassword]
        );
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - LOGIN

module.exports.getUserInfo = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - RESET PASSWORD

module.exports.addSecretCode = (email, code) => {
    return db.query(
        `INSERT INTO reset_codes(email, code) VALUES ($1, $2) RETURNING *`,
        [email, code]
    );
};

module.exports.checkSecretCode = () => {
    return db.query(
        `SELECT code FROM reset_codes WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'`
    );
};

module.exports.updatePassword = (password, email) => {
    return hashPassword(password).then((hashedPassword) => {
        return db.query(`UPDATE users SET password =$1 WHERE email = $2`, [
            hashedPassword,
            email,
        ]);
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - USER INFO

module.exports.getUserInfoFromId = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - PICTURE

module.exports.insertImage = (id, url) => {
    return db.query(`UPDATE users SET url=$1 WHERE id = $2`, [url, id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - BIO

module.exports.insertBio = (id, bio) => {
    return db.query(`UPDATE users SET bio=$2 WHERE id = $1 RETURNING *`, [
        id,
        bio,
    ]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FIND PEOPLE

module.exports.getLastUsers = (id) => {
    return db.query(
        `SELECT * FROM users WHERE id != $1 ORDER BY id DESC LIMIT 3`,
        [id]
    );
};

module.exports.getUsersByName = (val) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 ORDER BY first ASC LIMIT 3`,
        [val + "%"]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - FRIENDSHIPS

//
module.exports.requestFriendship = (idSender, idReceiver) => {
    return db.query(
        `INSERT INTO friendships (sender_id, receiver_id) VALUES ($1, $2) RETURNING *`,
        [idSender, idReceiver]
    );
};

module.exports.acceptFriendship = (idSender, idReceiver) => {
    return db.query(
        `UPDATE friendships SET accepted='true' WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
        [idSender, idReceiver]
    );
};

module.exports.deleteFriendship = (idSender, idReceiver) => {
    return db.query(
        `DELETE FROM friendships WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
        [idSender, idReceiver]
    );
};

module.exports.checkFriendship = (idSender, idReceiver) => {
    return db.query(
        `SELECT * FROM friendships WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
        [idSender, idReceiver]
    );
};

module.exports.getFriendsAndWannabes = (id) => {
    return db.query(
        `SELECT users.id, first, last, url, accepted FROM users JOIN friendships ON (accepted = true AND receiver_id = $1 AND users.id = friendships.sender_id) OR (accepted = true AND sender_id = $1 AND users.id = friendships.receiver_id) OR (accepted = false AND receiver_id = $1 AND users.id = friendships.sender_id)`,
        [id]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CHAT

module.exports.insertMessage = (message, id) => {
    return db.query(
        `INSERT INTO chat (text, author_id) VALUES ($1, $2) RETURNING *`,
        [message, id]
    );
};

module.exports.getLastMessages = () => {
    return db.query(
        `SELECT users.id, first, last, url, text, timestamp FROM chat JOIN users ON author_id=users.id ORDER BY timestamp DESC LIMIT 10`
    );
};
