const mailer = require ('./mailer');

module.exports = {
    rsvp: mailer.rsvp,
    payment: mailer.payment
}