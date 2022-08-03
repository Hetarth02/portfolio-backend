const express = require("express");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const app = express();

dotenv.config({ path: "./.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
    port: 465,
    service: "smtp.gmail.com",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
    secure: true,
});

app.post("/send-mail", (req, res) => {
    let send_data = req.body;
    const mail_data = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: "Inquiry",
        text: `
        ${send_data.first_name} ${send_data.last_name} sent you an inquiry having the contents as follows,

        ${send_data.message}

        You can contact them on ${send_data.email}.`,
    };

    transporter.sendMail(mail_data, (error, info) => {
        if (error) {
            res.status(404).send({ message: "Something went wrong, Please try again!" });
        }
        res.status(200).send({ message: "Email sent successfully!" });
    });
});