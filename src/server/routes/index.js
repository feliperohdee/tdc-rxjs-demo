"use strict";
var Socket_1 = require('./Socket');
var Http_1 = require('./Http');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (server) {
    var socket = new Socket_1.Socket(server);
    var http = new Http_1.Http(server);
};
//# sourceMappingURL=index.js.map