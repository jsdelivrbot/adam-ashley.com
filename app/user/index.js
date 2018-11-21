const user = require('./user');

module.exports = {
    login: user.login,
    logout: user.logout,
    isAdmin: user.isAdmin,
    isUser: user.isUser
}