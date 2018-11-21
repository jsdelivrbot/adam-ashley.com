require("dotenv").config();

const express = require("express");
const path = require("path");
const url = require("url");
const session = require("client-sessions");
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const config = require("./app/config");

const ENVIRONMENT = config.ENVIRONMENT;
const PORT = config.PORT;
const SESSIONKEY = config.SESSIONKEY;
const ACCESSCODE = config.ACCESSCODE;
const ADMINCODE = config.ADMINCODE;

const user = require("./app/user");
const payments = require("./app/payments");
const mailer = require("./app/mailer");

var forceSSL = function(req, res, next) {
    var schema = req.headers["x-forwarded-proto"];

    if (schema === "http" && ENVIRONMENT !== "development") {
        res.redirect("https://" + req.headers.host + req.url);
    }

    next();
};

express()
    .use(express.static(path.join(__dirname, "public")))
    .use("/scripts", express.static(path.join(__dirname, "node_modules/")))
    .use(
        session({
            cookieName: "session",
            secret: SESSIONKEY,
            duration: 30 * 60 * 1000,
            activeDuration: 5 * 60 * 1000
        })
    )
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "ejs")
    .get("/", user.isUser, (req, res) => res.render("pages/index"))
    .get("/login", (req, res) => res.render("pages/login"))
    .get("/sales", forceSSL, user.isAdmin, (req, res) =>
        res.render("pages/ticketsales", { publicKey: config.stripe.publicKey })
    )
    .get("/logout", user.logout)
    .post("/login", urlencodedParser, user.login)
    .post("/rsvp", user.isUser, urlencodedParser, mailer.rsvp)
    .post("/app/p", user.isAdmin, urlencodedParser, payments.charge)
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
