var config = require('./config');

module.exports = {
    ENVIRONMENT: config.server.environment,
    PORT: config.server.port,
    SESSIONKEY: config.server.sessionKey,
    ACCESSCODE: config.server.accessCode,
    ADMINCODE: config.server.adminCode,
    stripe: {
        privateKey: config.payment.stripe.keys[config.server.environment].private,
        publicKey: config.payment.stripe.keys[config.server.environment].public,
    },
    mailer: config.mailer
}