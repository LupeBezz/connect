/* eslint-disable no-unused-vars */

const aws = require("aws-sdk");
const fs = require("fs");

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - secrets stuff

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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - function that sends email
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - upload function that talks to AWS

// exports.upload = (req, res, next) => {
//     if (!req.file) {
//         return res.sendStatus(500);
//     }

//     // - - - - - - - - - - - - - - - - - - - - - - - - - - check req.file to understand what it is

//     console.log(req.file);

//     const { filename, mimetype, size, path } = req.file;

//     // - - - - - - - - - - - - - - - - - - - - - - - - - - putObject method > what is returned is stored in the promise

//     const promise = s3
//         .putObject({
//             Bucket: "spicedling",
//             ACL: "public-read",
//             Key: filename,
//             Body: fs.createReadStream(path),
//             ContentType: mimetype,
//             ContentLength: size,
//         })
//         .promise();

//     // - - - - - - - - - - - - - - - - - - - - - - - - - - what returns we store in the promise variable and handle it here:

//     promise
//         .then(() => {
//             console.log("amazon upload successful");
//             next();
//             //fs.unlink(path, () => {}); - - - - - - - - - this is optional, it means the image will be deleted from the upload folder
//         })
//         .catch((err) => {
//             console.log("error in upload put object: ", err);
//             res.sendStatus(404);
//         });
// };
