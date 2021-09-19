const express = require('express');
const app = express();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const port = 8080;
mongoose.connect("mongodb://localhost:27017/nodemailer");
const newsletterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String
})
const Newsletter = mongoose.model("Newsletter", newsletterSchema);
/***** node mailer config  *******/
const tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
});

app.get("/", (req, res) => {
    res.send("Welcome nodemailer newsletter");
});
app.get("/email", (req, res) => {
    try {
        var option = {
            from: "testraspberrypi7@gmail.com",
            to: "ahmeddridi.1234@gmail.com",
            subject: `We happily annouce the launching of our new Service : `,
            text: "this is a mail test ",
        }
        tranporter.sendMail(option, function (err, info) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(info.response);
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }


});
//Getting all newsletters route
app.get("/newsletter", (req, res) => {
    const newsletters = Newsletter.find({}).then(results => {
        res.status(200).json(results);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    })
})
//Posting an newsletter Route
app.post("/newsletter", (req, res) => {

    const newsletter = new Newsletter({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
    });
    //Saving the newsletter object to database
    newsletter.save().then(result => {
        console.log(result)
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json({ error: err.message });
    })
})


app.listen(port, () => {
    console.log(`connected on port ${port}`);
})






