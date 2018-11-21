const config = {
    server: {
        environment: process.env.APP_ENV || "development",
        port: process.env.APP_PORT || 3000,
        accessCode: process.env.APP_ACCESS_CODE || "",
        adminCode: process.env.APP_ADMIN_ACCESS_CODE || "admin",
        sessionKey: process.env.SESSION_KEY || "afnsvlfsvksmdflkdma134@@"
    },
    payment: {
        stripe: {
            keys: {
                development: {
                    private: process.env.STRIPE_DEVELOPMENT_PRIVATE || null,
                    public: process.env.STRIPE_DEVELOPMENT_PUBLIC || null
                },
                production: {
                    private: process.env.STRIPE_PRODUCTION_PRIVATE || null,
                    public: process.env.STRIPE_PRODUCTION_PUBLIC || null
                }
            }
        }
    },
    mailer: {
        transporter: {
            host: process.env.MAIL_HOST || null,
            port: process.env.MAIL_PORT || null,
            secure: process.env.MAIL_SECURE || null,
            user: process.env.MAIL_USERNAME || null,
            password: process.env.MAIL_PASSWORD || null
        }
    }
};

module.exports = {
    server: config.server,
    payment: config.payment,
    mailer: config.mailer
};
