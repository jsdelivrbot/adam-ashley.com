const config = require('../config');

const ACCESSCODE    = config.ACCESSCODE;
const ADMINCODE     = config.ADMINCODE;

const user = {
    login: function(req, res) {
        if (req.body.accessCode.toLowerCase() === ACCESSCODE) {
            user.setUser(req, res);
            res.redirect('/');
      
        } else if (req.body.accessCode === ADMINCODE) {
            user.setAdmin(req, res);
            res.redirect('/sales');
      
        } else {
            res.render('pages/login', { error: 'You\'re going to have to keep looking!' });
          
        }
    },
    logout: function(req, res) {
        req.session.destroy();
        res.redirect('/');
    },
    setAdmin: function(req, res) {
        req.session.user = ACCESSCODE;
        req.session.userRole = 'admin';

    },
    setUser: function(req, res) {
        req.session.user = ACCESSCODE;
    },
    isUser: function(req, res, next) {
        if (req.session.user === ACCESSCODE) {
            next();

        } else {
            res.redirect('/login');

        }
    },
    isAdmin: function(req, res, next) {
        if (req.session.user === ACCESSCODE && req.session.userRole === 'admin') {
            next()
      
        } else {
            res.status(403).send('You do not have permission to access this content.');

        }
    }
}

module.exports = {
    login: user.login,
    logout: user.logout,
    isAdmin: user.isAdmin,
    isUser: user.isUser
}