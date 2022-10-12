/* eslint-disable no-unused-vars */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - middleware

// amazon web services
const aws = require("aws-sdk");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets middleware

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - email middleware

// function used in server.js, the code is randomly generated there and stored in the db, then sent per email

exports.sendCodeEmail = function (code) {
    return ses
        .sendEmail({
            Source: "Speckle Hawthorn <speckle.hawthorn@spicedling.email>",
            Destination: {
                ToAddresses: ["lupei.bc@gmail.com"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `We heard you forgot your password, you can use this code to reset it: ${code}`,
                    },
                },
                Subject: {
                    Data: "Here is the code to reset your password",
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};
