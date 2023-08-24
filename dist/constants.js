"use strict";
if (process.env.NODE_ENV === 'production') {
    module.exports = ('./const.prod');
}
else {
    module.exports = require('./const.prod');
}
//# sourceMappingURL=constants.js.map