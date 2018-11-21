var nodemailer = require("nodemailer");
var EmailTemplate = require("email-templates-v2").EmailTemplate;
var path = require("path");

var config = require("../config");

var transporter = nodemailer.createTransport({
    host: config.mailer.transporter.host,
    port: config.mailer.transporter.port,
    secure: config.mailer.transporter.secure,
    auth: {
        user: config.mailer.transporter.user,
        pass: config.mailer.transporter.password
    }
});

var rsvp = {
    guests: [],
    songRequests: "",
    requestHandler: function(req, res) {
        if (typeof req.body.name == "string") {
            // rsvp contained only a single guest
            // change req.body data to be of type array
            req.body.name = [req.body.name];
            req.body.email = [req.body.email];
            req.body.allergy = [req.body.allergy];
        }

        rsvp.guests = [];
        rsvp.songRequests = req.body.songRequests;
        var rsvpNum = 0;
        for (var i = 0; i < req.body.name.length; i++) {
            // rsvpNum corresponds to guest number on form being submitted (1-6)
            rsvpNum = i + 1;
            rsvp.guests.push({
                name: req.body.name[i],
                email: req.body.email[i],
                dietary: req.body["dietary[" + rsvpNum + "]"],
                allergy: req.body.allergy[i]
            });
        }

        var sendResult = rsvp.send();

        if (sendResult) {
            console.log("Email Sent");
            res.status(200).send({
                type: "success",
                message: "Your RSVP has been sent! We're looking forward to sharing our special day with you!"
            });
        } else {
            res.status(400).send({
                type: "error",
                message:
                    "Something went wrong! Your RSVP could not be sent. Please either try again later or email us directly at maciukwedding@outlook.com"
            });
        }
    },
    send: function() {
        var templateDir = path.join(__dirname, "templates", "rsvp");
        var rsvpTemplate = new EmailTemplate(templateDir);
        var data = {
            guests: rsvp.guests,
            songRequests: rsvp.songRequests
        };
        rsvpTemplate.render(data, function(err, result) {
            if (err) {
                console.log(err);
                return false;
            } else {
                let mailOptions = {
                    from: '"Adam & Ashley" <' + process.env.MAIL_CONTACT_FROM_EMAIL + ">",
                    to: process.env.MAIL_CONTACT_TO_EMAIL || null,
                    subject: "RSVP Form Submission",
                    text: result.text,
                    html: result.html
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return false;
                    }
                });
            }
        });

        return true;
    }
};

var payment = {
    send: function(items, customerEmail) {
        var templateDir = path.join(__dirname, "templates", "payment");
        var paymentTemplate = new EmailTemplate(templateDir);
        var data = {
            items: items,
            customer: {
                email: customerEmail
            }
        };
        paymentTemplate.render(data, function(err, result) {
            if (err) {
                console.log(err);
                return false;
            } else {
                let mailOptions = {
                    from: '"Adam & Ashley" <' + process.env.MAIL_CONTACT_FROM_EMAIL + ">",
                    to: process.env.MAIL_CONTACT_TO_EMAIL || null,
                    subject: "Online Checkout Receipt",
                    text: result.text,
                    html: result.html
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return false;
                    }
                });
            }
        });

        return true;
    }
};

module.exports = {
    rsvp: rsvp.requestHandler,
    payment: payment.send
};
