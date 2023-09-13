if (process.env.NODE_ENV === 'production') {
    module.exports  = ('./const.prod');
} else {
    module.exports = require('./const.dev');
}