const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://narmathaperiyasamyp_db_user:db123@cluster0.lyvmmid.mongodb.net/passkey?appName=Cluster0")
    .then(function () {
        console.log("Connected to DB")
    }).catch(function () {
        console.log("Failed to connect")
    })
const credentialSchema = new mongoose.Schema({
    user: String,
    pass: String
});

const credential = mongoose.model(
    "credential",
    credentialSchema,
    "bulkmail"
);

const historydetails = new mongoose.Schema({
    subject: String,
    message: String,
    recipients: [String],
    status: String
})


const emailHistory = mongoose.model(
    "emailHistory",
    historydetails,
    "emailhistory"
);
app.post("/sendemail", (req, res) => {
    var sub = req.body.sub;
    var msg = req.body.msg;
    var emailList = req.body.emailList;
    console.log("Database:", mongoose.connection.name);
    console.log("Collection:", credential.collection.name);

    credential.find()
        .then(function (data) {
            console.log("Credentials found:", data.length);
            console.log("Gmail exists:", Boolean(data[0] && data[0].user));
            console.log("Password exists:", Boolean(data[0] && data[0].pass));
            console.log("Retrieved document:", data[0]);
            if (data.length === 0) {
                console.log("No email credentials found");
                return Promise.reject(
                    new Error("No email credentials found")
                );
            }
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: data[0].user,
                    pass: data[0].pass
                }
            });

            var emailSending = [];

            for (var i = 0; i < emailList.length; i++) {
                emailSending.push(
                    transporter.sendMail({
                        from: data[0].user,
                        to: emailList[i],
                        subject: sub,
                        text: msg
                    })
                );
            }

            return Promise.all(emailSending);
        })
        .then(function () {

            const history = new emailHistory({
                subject: sub,
                message: msg,
                recipients: emailList,
                status: "Success"
            });

            return history.save();
        })
        .then(function () {
            console.log("Email history saved successfully");
            res.send(true);
        })
        .catch(function (error) {
            console.log("Full error:", error);

            if (!res.headersSent) {
                res.status(500).send(false);
            }
        });
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});