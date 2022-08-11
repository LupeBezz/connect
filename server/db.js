/* eslint-disable no-unused-vars */

const bcrypt = require("bcryptjs");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - local / heroku databases

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

const spicedPg = require("spiced-pg");
const db = spicedPg(dbUrl);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets

let sessionSecret;

if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets.json").SESSION_SECRET;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - functions used in the registration page

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - functions used in the login page

module.exports.getUserInfo = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - functions used in the reset password page

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - functions used in the app page

module.exports.getUserInfoFromId = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function used to upload picture

module.exports.insertImage = (id, url) => {
    return db.query(`UPDATE users SET url=$1 WHERE id = $2`, [url, id]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function used to insert the bio

module.exports.insertBio = (id, bio) => {
    return db.query(`UPDATE users SET bio=$2 WHERE id = $1 RETURNING *`, [
        id,
        bio,
    ]);
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function used in the findpeople page

module.exports.getLastUsers = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 3`);
};

module.exports.getUsersByName = (val) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 ORDER BY first ASC LIMIT 3`,
        [val + "%"]
    );
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function used in the friendships table

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
