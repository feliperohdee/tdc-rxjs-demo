"use strict";
var restify_1 = require('restify');
var path_1 = require('path');
var Http = (function () {
    function Http(server) {
        server.get('/', restify_1.serveStatic({
            directory: path_1.resolve('./public'),
            file: 'index.html'
        }));
        server.get(/\/__client__\/?.*/, restify_1.serveStatic({
            directory: path_1.resolve('./')
        }));
    }
    return Http;
}());
exports.Http = Http;
//# sourceMappingURL=Http.js.map