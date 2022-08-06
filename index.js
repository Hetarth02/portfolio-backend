const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();

dotenv.config({ path: "./.env" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

app.post("/send-mail", (req, res) => {
    let send_data = req.body;
    const email_data = `${send_data.first_name} ${send_data.last_name} sent you an inquiry having the contents as follows,

${send_data.message}

You can contact them on ${send_data.email}.`;

    const mail_data = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: "Inquiry",
        text: email_data,
    };

    transporter.sendMail(mail_data, (error, info) => {
        if (error) {
            return res.status(404).send({ message: "Something went wrong, Please try again!" });
        }
        return res.status(200).send({ message: "Email sent successfully!" });
    });
});

app.listen(process.env.PORT || 3000, () => console.log("Status: Server Active!"));
