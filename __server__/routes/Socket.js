"use strict";
var lib_1 = require('../lib');
var Socket = (function () {
    function Socket(server) {
        var _this = this;
        this.socket = lib_1.SocketInterface.instance;
        server.get('/ws', function (req, res, next) {
            if (!res.claimUpgrade) {
                return next(new Error('Connection must upgrade for webSockets'));
            }
            var upgrade = res.claimUpgrade();
            try {
                _this.socket.handleUpgrade(req, upgrade.socket, upgrade.head);
            }
            catch (err) {
                next(err);
            }
        });
    }
    return Socket;
}());
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map