const config = require('../config');
const mailer = require('../mailer');

var stripe = require("stripe")(config.stripe.privateKey);

const defaultCurrency = 'cad';
var error = "";

const payments = {
    charge: function(amount, source, receiptEmail, description) {
        stripe.charges.create({
            amount: amount,
            currency: defaultCurrency,
            source: source,
            receipt_email: receiptEmail,
            description: description
        }), function(err, charge) {
            error = err;
        }
    }, 
    requestHandler: function(req, res) {
        // TODO: Validate input and make sure request is coming from the website.
        error = "";
        var desc = '';
        var items = JSON.parse(req.body.items);
        for (var key in items) {
            desc += items[key].name + ' - $' + payments.stripeAmountToString(items[key].amount) + '\n';
        }
        desc += "\nThank you for supporting us at our Jack & Jill!";

        // Charge the card with Sripe
        payments.charge(
            req.body.amount,
            req.body.token, 
            req.body.email,
            desc
        );

        if (error ==="") {
            mailer.payment(items, req.body.email);
            res.status(200).send({ 
                type: 'success',
                message: 'Payment successfully processed! Thank you.'
            });
            console.log('success');
        } else {
            res.status(500).send({
                type: 'error',
                message: 'Payment failed.'
            });
        }
    },
    stripeAmountToString: function(amount) {
        return parseFloat(Math.round(amount*100) / 10000).toFixed(2);
    }
}

module.exports = {
    charge: payments.requestHandler
}