"use strict";
var routes_1 = require('./routes');
var lib_1 = require('./lib');
var restify_1 = require('restify');
var Boot = (function () {
    function Boot() {
        this.socketServer = lib_1.SocketInterface.instance.server();
        this.server = restify_1.createServer({
            handleUpgrades: true
        });
        this.server.opts(/.*/, function (req, res, next) { return res.send(200); });
        routes_1.default(this.server);
        this.server.listen(process.env.PORT || 3000, function () { return console.log("server running on " + (process.env.PORT || 3000) + " and pid " + process.pid); });
    }
    return Boot;
}());
exports.Boot = Boot;
//# sourceMappingURL=Boot.js.map